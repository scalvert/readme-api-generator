#!/usr/bin/env node

const meow = require('meow');
const { getReadme, generateMarkdown, writeDocs, setMarker } = require('../index');

const cli = meow(
  `
	Usage
	  $ readme-api-generator <path to js file(s) or directory>

  Options
    --marker, -m Specify a custom marker

	Examples
	  $ readme-api-generator lib/foo.js lib/bar.js
`,
  {
    flags: {
      marker: {
        type: 'string',
        alias: 'm',
      },
    },
  }
);

(async function () {
  const workingDir = process.cwd();

  setMarker(cli.flags.marker);

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
