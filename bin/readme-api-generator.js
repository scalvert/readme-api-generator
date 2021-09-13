#!/usr/bin/env node

const meow = require('meow');
const { getReadme, writeDocs, generateMarkdown } = require('../index');

const cli = meow(
  `
	Usage
	  $ readme-api-generator <path to js file(s) or directory>

	Examples
	  $ readme-api-generator lib/foo.js lib/bar.js
`
);

(async function () {
  const workingDir = process.cwd();

  try {
    const [readmePath, readmeContent] = getReadme(workingDir);

    let docsContent = await generateMarkdown(cli.input);

    writeDocs(readmePath, readmeContent, docsContent);

    console.log('README content updated');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
})();
