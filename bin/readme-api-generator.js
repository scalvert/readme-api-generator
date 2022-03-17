#!/usr/bin/env node

const meow = require('meow');
const { getReadme, generateMarkdown, writeDocs, setMarker } = require('../index');

const cli = meow(
  `
	Usage
	  $ readme-api-generator <path to file(s) or directory>

  Options
    --typescript, --ts Generate from TypeScript files
    --marker, -m Specify a custom marker

	Examples
	  $ readme-api-generator lib/foo.js lib/bar.ts
`,
  {
    flags: {
      typescript: {
        type: 'boolean',
        alias: 'ts',
        default: false,
      },
      marker: {
        type: 'string',
        alias: 'm',
      },
    },
  }
);

(async function () {
  const workingDir = process.cwd();

  try {
    setMarker(cli.flags.marker);
    const [readmePath, readmeContent] = getReadme(workingDir);

    let docsContent = await generateMarkdown(cli.input, cli.flags);

    writeDocs(readmePath, readmeContent, docsContent);

    console.log('README content updated');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
})();
