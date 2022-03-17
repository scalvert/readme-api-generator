const path = require('path');
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');

const DEFAULT_MARKER = 'DOCS';
let _placeholder;
let _marker = DEFAULT_MARKER;

function setMarker(marker = DEFAULT_MARKER) {
  _marker = marker;
  _placeholder = new RegExp(`<!--${_marker}_START-->[\\S\\s]*<!--${_marker}_END-->`);
}

/**
 * Gets a list of files to be used to generate the Markdown content.
 *
 * @param {Array<string>} filesOrDirectory - The list of files or directory to read.
 * @returns A list of files to be used to generate the markdown.
 */
function getFiles(filesOrDirectory) {
  if (
    filesOrDirectory.length === 1 &&
    fs.statSync(filesOrDirectory[0]).isDirectory() &&
    fs.existsSync(filesOrDirectory[0])
  ) {
    return fs
      .readdirSync(filesOrDirectory[0])
      .filter((file) => ['.js', '.ts'].includes(path.extname(file)))
      .map((file) => path.join(filesOrDirectory[0], file));
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
function getReadme(workingDir) {
  const readmePath = path.resolve(workingDir, 'README.md');

  try {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    if (!readmeContent.match(_placeholder)) {
      throw new Error(
        `The README does not contain a valid placeholder (<!--${_marker}_START--> followed by a <!--${_marker}_END--> HTML comment)`
      );
    }

    return [readmePath, readmeContent];
  } catch (error) {
    if (error.code === 'ENOENT') {
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
 * @param {Array<string>} files - The list of files to generate the markdown content.
 * @returns The rendered markdown.
 */
async function generateMarkdown(files, flags) {
  let options = {
    files: getFiles(files),
  };

  if (flags.typescript) {
    options = {
      ...options,
      ...{
        configure: require.resolve('./jsdoc2md.json'),
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
function writeDocs(readmePath, readmeContent, docsContent) {
  fs.writeFileSync(
    readmePath,
    readmeContent.replace(
      _placeholder,
      `<!--${_marker}_START-->\n${docsContent}\n<!--${_marker}_END-->`
    )
  );
}

module.exports = {
  getFiles,
  getReadme,
  generateMarkdown,
  setMarker,
  writeDocs,
};
