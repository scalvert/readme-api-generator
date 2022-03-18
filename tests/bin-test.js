import path from 'path';
import fs from 'fs';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Project } from 'fixturify-project';
import execa from 'execa';

class FakeProject extends Project {
  write(dirJSON) {
    Object.assign(this.files, dirJSON);
    this.writeSync();
  }
}

describe('readme-api-generator', () => {
  let project;

  beforeEach(() => {
    project = new FakeProject();

    project.writeSync();
  });

  afterEach(() => {
    project.dispose();
  });

  it('returns error if no README is present', async () => {
    let result = await run();

    expect(result.stderr).toMatchInlineSnapshot(
      `"No README found. Please run readme-api-generator from a directory that contains a README.md file."`
    );
    expect(result.exitCode).toEqual(1);
  });

  it('returns error if README does not contain start or end placeholders', async () => {
    project.write({
      'README.md': '',
    });

    let result = await run();

    expect(result.stderr).toMatchInlineSnapshot(
      `"The README does not contain a valid placeholder (<!--DOCS_START--> followed by a <!--DOCS_END--> HTML comment)"`
    );
    expect(result.exitCode).toEqual(1);
  });

  it('returns error if README does not contain start placeholder', async () => {
    project.write({
      'README.md': '<!--DOCS_END-->',
    });

    let result = await run();

    expect(result.stderr).toMatchInlineSnapshot(
      `"The README does not contain a valid placeholder (<!--DOCS_START--> followed by a <!--DOCS_END--> HTML comment)"`
    );
    expect(result.exitCode).toEqual(1);
  });

  it('returns error if README does not contain end placeholder', async () => {
    project.write({
      'README.md': '<!--DOCS_START-->',
    });

    let result = await run();

    expect(result.stderr).toMatchInlineSnapshot(
      `"The README does not contain a valid placeholder (<!--DOCS_START--> followed by a <!--DOCS_END--> HTML comment)"`
    );
    expect(result.exitCode).toEqual(1);
  });

  it('writes content for single file', async () => {
    project.write({
      'README.md': `Fake readme
<!--DOCS_START--><!--DOCS_END-->`,
      'protection.js': `/**
 * A quite wonderful function.
 * @param {object} - Privacy gown
 * @param {object} - Security
 * @returns {survival}
 */
function protection (cloak, dagger) {}
`,
    });

    let result = await run(['protection.js']);

    expect(result.stdout).toMatchInlineSnapshot(`"README content updated"`);
    expect(
      fs.readFileSync(path.join(project.baseDir, 'README.md'), {
        encoding: 'utf-8',
      })
    ).toMatchSnapshot();
    expect(result.exitCode).toEqual(0);
  });

  it('writes content for multiple files', async () => {
    project.write({
      'README.md': `Fake readme
<!--DOCS_START--><!--DOCS_END-->`,
      'protection.js': `/**
 * A quite wonderful function.
 * @param {object} - Privacy gown
 * @param {object} - Security
 * @returns {survival}
 */
function protection (cloak, dagger) {}
`,
      'defense.js': `/**
 * Another wonderful function.
 * @param {object} - Privacy gown
 * @param {object} - Security
 * @returns {alive}
 */
function defense (cloak2, dagger2) {}
`,
    });

    let result = await run(['protection.js', 'defense.js']);

    expect(result.stdout).toMatchInlineSnapshot('"README content updated"');
    expect(
      fs.readFileSync(path.join(project.baseDir, 'README.md'), {
        encoding: 'utf-8',
      })
    ).toMatchSnapshot();
    expect(result.exitCode).toEqual(0);
  });

  it('writes content for directories', async () => {
    project.write({
      'README.md': `Fake readme
<!--DOCS_START--><!--DOCS_END-->`,
      lib: {
        'protection.js': `/**
   * A quite wonderful function.
   * @param {object} - Privacy gown
   * @param {object} - Security
   * @returns {survival}
   */
  function protection (cloak, dagger) {}
  `,
        'defense.js': `/**
   * Another wonderful function.
   * @param {object} - Privacy gown
   * @param {object} - Security
   * @returns {alive}
   */
  function defense (cloak2, dagger2) {}
  `,
      },
    });

    let result = await run(['lib']);

    expect(result.stdout).toMatchInlineSnapshot('"README content updated"');
    expect(
      fs.readFileSync(path.join(project.baseDir, 'README.md'), {
        encoding: 'utf-8',
      })
    ).toMatchSnapshot();
    expect(result.exitCode).toEqual(0);
  });

  it('can use custom markers', async () => {
    project.write({
      'README.md': `Fake readme
<!--CUSTOM_START--><!--CUSTOM_END-->`,
      'protection.js': `/**
 * A quite wonderful function.
 * @param {object} - Privacy gown
 * @param {object} - Security
 * @returns {survival}
 */
function protection (cloak, dagger) {}
`,
    });

    let result = await run(['protection.js', '--marker', 'CUSTOM']);

    expect(result.stdout).toMatchInlineSnapshot('"README content updated"');
    expect(
      fs.readFileSync(path.join(project.baseDir, 'README.md'), {
        encoding: 'utf-8',
      })
    ).toMatchSnapshot();
    expect(result.exitCode).toEqual(0);
  });

  function run(args = [], options = {}) {
    let defaults = {
      reject: false,
      cwd: project.baseDir,
    };

    return execa(
      process.execPath,
      [require.resolve('../bin/readme-api-generator.js'), ...args],
      Object.assign({}, defaults, options)
    );
  }
});
