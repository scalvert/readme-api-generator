import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'node:url';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { BinTesterProject, createBinTester } from '@scalvert/bin-tester';

describe('readme-api-generator', () => {
  let project: BinTesterProject;
  const { setupProject, teardownProject, runBin } = createBinTester({
    binPath: fileURLToPath(new URL('../bin/readme-api-generator.js', import.meta.url)),
  });

  beforeEach(async () => {
    project = await setupProject();
  });

  afterEach(() => {
    teardownProject();
  });

  it('returns error if no README is present', async () => {
    const result = await runBin();

    expect(result.stderr).toMatchInlineSnapshot(
      `"No README found. Please run readme-api-generator from a directory that contains a README.md file."`
    );
    expect(result.exitCode).toEqual(1);
  });

  it('returns error if README does not contain start or end placeholders', async () => {
    await project.writeDirJSON({
      'README.md': '',
    });

    const result = await runBin();

    expect(result.stderr).toMatchInlineSnapshot(
      `"The README does not contain a valid placeholder (<!--DOCS_START--> followed by a <!--DOCS_END--> HTML comment)"`
    );
    expect(result.exitCode).toEqual(1);
  });

  it('returns error if README does not contain start placeholder', async () => {
    await project.writeDirJSON({
      'README.md': '<!--DOCS_END-->',
    });

    const result = await runBin();

    expect(result.stderr).toMatchInlineSnapshot(
      `"The README does not contain a valid placeholder (<!--DOCS_START--> followed by a <!--DOCS_END--> HTML comment)"`
    );
    expect(result.exitCode).toEqual(1);
  });

  it('returns error if README does not contain end placeholder', async () => {
    await project.writeDirJSON({
      'README.md': '<!--DOCS_START-->',
    });

    const result = await runBin();

    expect(result.stderr).toMatchInlineSnapshot(
      `"The README does not contain a valid placeholder (<!--DOCS_START--> followed by a <!--DOCS_END--> HTML comment)"`
    );
    expect(result.exitCode).toEqual(1);
  });

  it('writes content for single file', async () => {
    await project.writeDirJSON({
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

    const result = await runBin('protection.js');

    expect(result.stdout).toMatchInlineSnapshot(`"README content updated"`);
    expect(
      fs.readFileSync(path.join(project.baseDir, 'README.md'), {
        encoding: 'utf-8',
      })
    ).toMatchSnapshot();
    expect(result.exitCode).toEqual(0);
  });

  it('writes content for multiple files', async () => {
    await project.writeDirJSON({
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

    const result = await runBin('protection.js', 'defense.js');

    expect(result.stdout).toMatchInlineSnapshot('"README content updated"');
    expect(
      fs.readFileSync(path.join(project.baseDir, 'README.md'), {
        encoding: 'utf-8',
      })
    ).toMatchSnapshot();
    expect(result.exitCode).toEqual(0);
  });

  it('writes content for directories', async () => {
    await project.writeDirJSON({
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

    const result = await runBin('lib');

    expect(result.stdout).toMatchInlineSnapshot('"README content updated"');
    expect(
      fs.readFileSync(path.join(project.baseDir, 'README.md'), {
        encoding: 'utf-8',
      })
    ).toMatchSnapshot();
    expect(result.exitCode).toEqual(0);
  });

  it('can use custom markers', async () => {
    await project.writeDirJSON({
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

    const result = await runBin('protection.js', '--marker', 'CUSTOM');

    expect(result.stdout).toMatchInlineSnapshot('"README content updated"');
    expect(
      fs.readFileSync(path.join(project.baseDir, 'README.md'), {
        encoding: 'utf-8',
      })
    ).toMatchSnapshot();
    expect(result.exitCode).toEqual(0);
  });
});
