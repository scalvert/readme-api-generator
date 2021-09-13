#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const meow = require('meow');
const jsdoc2md = require('jsdoc-to-markdown');

const DOCS_PLACEHOLDER = /<!--DOCS_START-->[\S\s]*<!--DOCS_END-->/;

const cli = meow(
  `
	Usage
	  $ readme-api-generator <path to js file(s) or directory>

	Examples
	  $ readme-api-generator lib/foo.js lib/bar.js
`
);

function getFiles(input) {
  if (input.length === 1 && path.extname(input[0]) !== '.js' && fs.existsSync(input[0])) {
    return fs.readdirSync(input[0]).filter((file) => path.extname(file) === '.js');
  } else {
    return input;
  }
}

function getReadme(workingDir) {
  const readmePath = path.resolve(workingDir, 'README.md');

  try {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    if (!readmeContent.match(DOCS_PLACEHOLDER)) {
      throw new Error(
        'The README does not contain a valid placeholder (<!--DOCS_START--> followed by a <!--DOCS_END--> HTML comment)'
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

function writeDocs(readmePath, readmeContent, docsContent) {
  fs.writeFileSync(
    readmePath,
    readmeContent.replace(DOCS_PLACEHOLDER, `<!--DOCS_START-->\n\n${docsContent}\n<!--DOCS_END-->`)
  );
}

(async function () {
  const workingDir = process.cwd();

  try {
    const [readmePath, readmeContent] = getReadme(workingDir);

    let docsContent = await jsdoc2md.render({
      files: getFiles(cli.input),
    });

    writeDocs(readmePath, readmeContent, docsContent);

    console.log('README content updated');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
})();
