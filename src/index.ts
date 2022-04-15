import { join, extname, resolve } from 'node:path';
import { statSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import jsdoc2md from 'jsdoc-to-markdown';

const DEFAULT_MARKER = 'DOCS';
let _placeholder: RegExp;
let _marker: string = DEFAULT_MARKER;

export function setMarker(marker: string = DEFAULT_MARKER) {
  _marker = marker;
  _placeholder = new RegExp(`<!--${_marker}_START-->[\\S\\s]*<!--${_marker}_END-->`);
}

/**
 * Gets a list of files to be used to generate the Markdown content.
 *
 * @param {string[]} filesOrDirectory - The list of files or directory to read.
 * @returns A list of files to be used to generate the markdown.
 */
export function getFiles(filesOrDirectory: string[]) {
  if (
    filesOrDirectory.length === 1 &&
    statSync(filesOrDirectory[0]).isDirectory() &&
    existsSync(filesOrDirectory[0])
  ) {
    return readdirSync(filesOrDirectory[0])
      .filter((file) => ['.js', '.ts'].includes(extname(file)))
      .map((file) => join(filesOrDirectory[0], file));
  } else {
    return filesOrDirectory;
  }
}

/**
 * Gets and reads the contents of the README.md file.
 *
 * @param {string} workingDir - The current working directory.
 * @returns A tuple containing the readme file path and content.
 */
export function getReadme(workingDir: string) {
  const readmePath = resolve(workingDir, 'README.md');

  try {
    const readmeContent = readFileSync(readmePath, 'utf8');

    if (!readmeContent.match(_placeholder)) {
      throw new Error(
        `The README does not contain a valid placeholder (<!--${_marker}_START--> followed by a <!--${_marker}_END--> HTML comment)`
      );
    }

    return [readmePath, readmeContent];
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      throw new Error(
        'No README found. Please run readme-api-generator from a directory that contains a README.md file.'
      );
    }

    throw error;
  }
}

/**
 * Generates the markdown content from the supplied files.
 *
 * @param {string[]} files - The list of files to generate the markdown content.
 * @returns The rendered markdown.
 */
export async function generateMarkdown(files: string[], flags: Record<string, unknown>) {
  let options = {
    files: getFiles(files),
  };

  if (flags.typescript) {
    options = {
      ...options,
      ...{
        configure: fileURLToPath(new URL('../jsdoc2md.json', import.meta.url)),
      },
    };
  }

  return await jsdoc2md.render(options);
}

/**
 * Writes the markdown content into the README.md using the supplied placeholders as a marker to position the content.
 *
 * @param {string} readmePath - The path to the README.md file.
 * @param {string} readmeContent - The content read from the README.md file.
 * @param {string} docsContent - The generated markdown to be written to the README.md file.
 */
export function writeDocs(readmePath: string, readmeContent: string, docsContent: string) {
  writeFileSync(
    readmePath,
    readmeContent.replace(
      _placeholder,
      `<!--${_marker}_START-->\n${docsContent}\n<!--${_marker}_END-->`
    )
  );
}

const isNodeError = (error: unknown): error is NodeJS.ErrnoException => error instanceof Error;
