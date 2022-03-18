declare function setMarker(marker?: string): void;
/**
 * Gets a list of files to be used to generate the Markdown content.
 *
 * @param {string[]} filesOrDirectory - The list of files or directory to read.
 * @returns A list of files to be used to generate the markdown.
 */
declare function getFiles(filesOrDirectory: string[]): string[];
/**
 * Gets and reads the contents of the README.md file.
 *
 * @param {string} workingDir - The current working directory.
 * @returns A tuple containing the readme file path and content.
 */
declare function getReadme(workingDir: string): string[];
/**
 * Generates the markdown content from the supplied files.
 *
 * @param {string[]} files - The list of files to generate the markdown content.
 * @returns The rendered markdown.
 */
declare function generateMarkdown(files: string[], flags: Record<string, unknown>): Promise<string>;
/**
 * Writes the markdown content into the README.md using the supplied placeholders as a marker to position the content.
 *
 * @param {string} readmePath - The path to the README.md file.
 * @param {string} readmeContent - The content read from the README.md file.
 * @param {string} docsContent - The generated markdown to be written to the README.md file.
 */
declare function writeDocs(readmePath: string, readmeContent: string, docsContent: string): void;

export { generateMarkdown, getFiles, getReadme, setMarker, writeDocs };
