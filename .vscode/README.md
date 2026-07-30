# VSCode Configuration

This folder holds opt-in [Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings), [Tasks](https://code.visualstudio.com/docs/editor/tasks) and [Extension Recommendations](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions) recommended when working on this repository.

## Usage

- install the recommended extensions listed in `.vscode/extensions.json`
- copy (or symlink) `.vscode/recommended-settings.json` to `.vscode/settings.json`
- restart the editor

```bash
cp .vscode/recommended-settings.json .vscode/settings.json
# or, to always track upstream changes
ln -s recommended-settings.json .vscode/settings.json
```

`.vscode/settings.json` is git-ignored on purpose: it stays yours. If you already have workspace settings, merge the file contents manually instead of overwriting.

This isn't automatic, so repeat the copy when `recommended-settings.json` changes.

To browse the recommendations, run "Extensions: Show Recommended Extensions" from the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

## What the recommended settings do

- format on save with Prettier and ESLint `--fix` as a save action, matching the `lint-staged` pre-commit hook
- use the workspace TypeScript (`node_modules/typescript`) instead of the one bundled with VSCode
- exclude `node_modules`, `dist` and `coverage` from search and file watchers
- group files by type in the Explorer via [file nesting](https://code.visualstudio.com/docs/getstarted/userinterface#_file-nesting): `package.json` owns the package-manager files, `tsconfig.json` owns the tool configs, `README.md` owns the docs, and each `src/*/index.ts` barrel owns its siblings

## Tasks

`tasks.json` wraps the `package.json` scripts: `build`, `typecheck`, `lint`, `lint:check`, `test`, `test:watch`, plus a `verify` task chaining typecheck + lint:check + test + build (same order as `prepublishOnly`). `test` is the default test task, `build` the default build task.

Run them from the Command Palette with "Tasks: Run Task", or press `Ctrl+Shift+B` for `build`. The `$tsc` and `$eslint-stylish` problem matchers put failures in the Problems panel as clickable `file:line` links.

Test debugging is left to the `vitest.explorer` extension, which adds a per-test debug action in the editor.

## Editing `.vscode/recommended-*.json`

These files are shared by everyone working on the repo. Keep changes to things that help the development process and avoid altering personal workflow or UI preferences.
