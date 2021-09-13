# readme-api-generator

Generates API documentation for your README, converting JS to Markdown.

## Installation

With `npm`:

```sh-session
npm install readme-api-generator --save-dev
```

With `yarn`:

```sh-session
yarn add readme-api-generator --dev
```

## Usage

The `readme-api-generator` CLI uses `jsdoc-to-markdown` combined with HTML comment tokens in your README.md file to generate your API documentation. Follow these steps to set it up.

1. Add tokens to your README.md

   Add `<!--DOCS_START-->` and `<!--DOCS_END-->` HTML comments where you'd like your content to be generated.

   ```markdown
   Some text before the docs.

   <!--DOCS_START-->
   <!--DOCS_END-->

   Some text after the docs.
   ```

   :warning: All content in between these tags will be replaced!

2. Add a script to your package.json

   ```js
   "scripts": {
    "docs:generate": "readme-api-generator <files list or directory>"
   },
   ```

   For projects using TypeScript, you'll want to ensure your TS files are built before generating the docuemntation. The file/directory input should be from your `outDir`.

   ```js
   "scripts": {
    "docs:generate": "npm run build && readme-api-generator <files list or directory>"
   },
   ```

3. Write your jsdocs!

## API

<!--DOCS_START-->
<!--DOCS_END-->

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
