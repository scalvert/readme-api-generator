var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  generateMarkdown: () => generateMarkdown,
  getFiles: () => getFiles,
  getReadme: () => getReadme,
  setMarker: () => setMarker,
  writeDocs: () => writeDocs
});
module.exports = __toCommonJS(src_exports);

// node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// src/index.ts
var import_node_path = require("path");
var import_node_fs = require("fs");
var import_node_url = require("url");
var import_jsdoc_to_markdown = __toESM(require("jsdoc-to-markdown"), 1);
var DEFAULT_MARKER = "DOCS";
var _placeholder;
var _marker = DEFAULT_MARKER;
function setMarker(marker = DEFAULT_MARKER) {
  _marker = marker;
  _placeholder = new RegExp(`<!--${_marker}_START-->[\\S\\s]*<!--${_marker}_END-->`);
}
function getFiles(filesOrDirectory) {
  if (filesOrDirectory.length === 1 && (0, import_node_fs.statSync)(filesOrDirectory[0]).isDirectory() && (0, import_node_fs.existsSync)(filesOrDirectory[0])) {
    return (0, import_node_fs.readdirSync)(filesOrDirectory[0]).filter((file) => [".js", ".ts"].includes((0, import_node_path.extname)(file))).map((file) => (0, import_node_path.join)(filesOrDirectory[0], file));
  } else {
    return filesOrDirectory;
  }
}
function getReadme(workingDir) {
  const readmePath = (0, import_node_path.resolve)(workingDir, "README.md");
  try {
    const readmeContent = (0, import_node_fs.readFileSync)(readmePath, "utf8");
    if (!readmeContent.match(_placeholder)) {
      throw new Error(`The README does not contain a valid placeholder (<!--${_marker}_START--> followed by a <!--${_marker}_END--> HTML comment)`);
    }
    return [readmePath, readmeContent];
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      throw new Error("No README found. Please run readme-api-generator from a directory that contains a README.md file.");
    }
    throw error;
  }
}
async function generateMarkdown(files, flags) {
  let options = {
    files: getFiles(files)
  };
  if (flags.typescript) {
    options = __spreadValues(__spreadValues({}, options), {
      configure: (0, import_node_url.fileURLToPath)(new URL("./jsdoc2md.json", importMetaUrl))
    });
  }
  return await import_jsdoc_to_markdown.default.render(options);
}
function writeDocs(readmePath, readmeContent, docsContent) {
  (0, import_node_fs.writeFileSync)(readmePath, readmeContent.replace(_placeholder, `<!--${_marker}_START-->
${docsContent}
<!--${_marker}_END-->`));
}
var isNodeError = (error) => error instanceof Error;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateMarkdown,
  getFiles,
  getReadme,
  setMarker,
  writeDocs
});
