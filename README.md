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

<!--CUSTOM_START-->
## Functions

<dl>
<dt><a href="#getFiles">getFiles(filesOrDirectory)</a> ⇒</dt>
<dd><p>Gets a list of JS files to be used to generate the Markdown content.</p>
</dd>
<dt><a href="#getReadme">getReadme(workingDir)</a> ⇒</dt>
<dd><p>Gets and reads the contents of the README.md file.</p>
</dd>
<dt><a href="#generateMarkdown">generateMarkdown(files)</a> ⇒</dt>
<dd><p>Generates the markdown content from the supplied JS files.</p>
</dd>
<dt><a href="#writeDocs">writeDocs(readmePath, readmeContent, docsContent)</a></dt>
<dd><p>Writes the markdown content into the README.md using the supplied placeholders as a marker to position the content.</p>
</dd>
</dl>

<a name="getFiles"></a>

## getFiles(filesOrDirectory) ⇒
Gets a list of JS files to be used to generate the Markdown content.

**Kind**: global function  
**Returns**: A list of JS files to be used to generate the markdown.  

| Param | Type | Description |
| --- | --- | --- |
| filesOrDirectory | <code>Array.&lt;string&gt;</code> | The list of files or directory to read. |

<a name="getReadme"></a>

## getReadme(workingDir) ⇒
Gets and reads the contents of the README.md file.

**Kind**: global function  
**Returns**: A tuple containing the readme file path and content.  

| Param | Type | Description |
| --- | --- | --- |
| workingDir | <code>string</code> | The current working directory. |

<a name="generateMarkdown"></a>

## generateMarkdown(files) ⇒
Generates the markdown content from the supplied JS files.

**Kind**: global function  
**Returns**: The rendered markdown.  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>Array.&lt;string&gt;</code> | The list of files to generate the markdown content. |

<a name="writeDocs"></a>

## writeDocs(readmePath, readmeContent, docsContent)
Writes the markdown content into the README.md using the supplied placeholders as a marker to position the content.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| readmePath | <code>string</code> | The path to the README.md file. |
| readmeContent | <code>string</code> | The content read from the README.md file. |
| docsContent | <code>string</code> | The generated markdown to be written to the README.md file. |


<!--CUSTOM_END-->

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
