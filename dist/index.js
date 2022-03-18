var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/index.ts
import { join, extname, resolve } from "path";
import { statSync, existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import jsdoc2md from "jsdoc-to-markdown";
var DEFAULT_MARKER = "DOCS";
var _placeholder;
var _marker = DEFAULT_MARKER;
function setMarker(marker = DEFAULT_MARKER) {
  _marker = marker;
  _placeholder = new RegExp(`<!--${_marker}_START-->[\\S\\s]*<!--${_marker}_END-->`);
}
function getFiles(filesOrDirectory) {
  if (filesOrDirectory.length === 1 && statSync(filesOrDirectory[0]).isDirectory() && existsSync(filesOrDirectory[0])) {
    return readdirSync(filesOrDirectory[0]).filter((file) => [".js", ".ts"].includes(extname(file))).map((file) => join(filesOrDirectory[0], file));
  } else {
    return filesOrDirectory;
  }
}
function getReadme(workingDir) {
  const readmePath = resolve(workingDir, "README.md");
  try {
    const readmeContent = readFileSync(readmePath, "utf8");
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
      configure: fileURLToPath(new URL("./jsdoc2md.json", import.meta.url))
    });
  }
  return await jsdoc2md.render(options);
}
function writeDocs(readmePath, readmeContent, docsContent) {
  writeFileSync(readmePath, readmeContent.replace(_placeholder, `<!--${_marker}_START-->
${docsContent}
<!--${_marker}_END-->`));
}
var isNodeError = (error) => error instanceof Error;
export {
  generateMarkdown,
  getFiles,
  getReadme,
  setMarker,
  writeDocs
};
