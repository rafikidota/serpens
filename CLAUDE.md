# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@rafikidota/serpens` — a small npm library providing a TypeORM `SnakeNamingStrategy` plus string-case utilities (camelCase, snakeCase, titleCase). Published to npm, consumed by other projects as a TypeORM `namingStrategy`.

## Commands

- `npm run build` — bundle `src/` to `dist/` via `tsdown` (see `tsdown.config.ts`): dual CJS/ESM output (`dist/index.cjs`, `dist/index.mjs`) plus `.d.cts`/`.d.mts` declarations, with sourcemaps. No `prebuild` step; `tsdown`'s `clean: true` handles clearing `dist/` itself.
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — `npx eslint --debug . --fix`
- `npm run lint:check` — `npx eslint .` (no `--fix`, no `--debug`); this is the CI/publish-safe variant, since `--fix` would auto-mutate the checkout.
- `npm run format` — `prettier --write "**/*.ts"`
- `npm test` — runs the Vitest suite (`vitest run`); `npm run test:watch` for watch mode.
- `prepublishOnly` — runs typecheck + lint:check + build before any publish.
- Package manager is pnpm (`pnpm-lock.yaml`), despite npm-named scripts. Version is pinned via `packageManager` in `package.json` (pnpm 11.x); CI reads it instead of hardcoding a version.
- 18 Vitest tests live in `test/`: `camel-case.test.ts`, `snake-case.test.ts`, `title-case.test.ts`, `snake.test.ts`.

Pre-commit runs `lint-staged` via husky (`.husky/pre-commit`, which sources nvm first): staged `**/*.{ts,json}` files get `prettier --write` then `eslint`.

Branching is GitHub Flow: `main` is the only long-lived branch; work happens on short-lived `feat/*` / `fix/*` branches that merge into `main` via pull request, and releases are cut by pushing a `v*` tag on `main`.

Two GitHub Actions workflows:

- `ci.yml` — typecheck/lint:check/test/build. Triggers on push to any branch except `main`, on any pull request, and via `workflow_call`. `main` is deliberately excluded from the push trigger: every commit reaching `main` already ran CI on its pull request, and a release pushes the version commit and the `v*` tag together, so a push trigger on `main` would run CI twice per release (once for the branch push, once through `publish.yml`'s `workflow_call`). The `concurrency` group keys on `github.head_ref || github.ref` so a pull request run and the branch push run of the same commit share a group and the pull request run cancels the redundant push run.
- `publish.yml` — on `v*` tag push: calls `ci.yml` as a reusable workflow, then `pnpm publish --no-git-checks`. Has `id-token: write` for npm trusted publishing (provenance); no `NODE_AUTH_TOKEN` secret is used.

Both workflows pin actions by commit SHA and read the Node version from `.nvmrc` (currently 24.x).

## Architecture

Two independent export groups from `src/index.ts`:

- `src/strategy/` — `SnakeNamingStrategy` (`snake.ts`), extending TypeORM's `DefaultNamingStrategy` and implementing `NamingStrategyInterface`. Overrides `tableName`, `columnName` and `relationName` to produce snake_case, using the `util` snake-case function. This is the library's main product.
- `src/util/` — standalone string-case converters (`camel-case.ts`, `snake-case.ts`, `title-case.ts`), independent of TypeORM, used internally by `strategy` and also exported publicly.

Each subdirectory re-exports through its own `index.ts`; `src/index.ts` re-exports both barrels. When adding a new case-conversion util or naming strategy, follow this barrel pattern (add the file, then export it from the subdirectory's `index.ts`).

TypeORM is declared as a `peerDependency` (`"typeorm": "^1.1.0"`), not a runtime `dependency` — consumers must supply their own TypeORM install; it's also present as a `devDependency` for local development/tests.

## TypeScript config notes

- The package itself is ESM-first (`"type": "module"` in `package.json`), and ships both CJS and ESM to consumers through the `exports` map.
- Target/lib `ES2022`, `module: ESNext`, `moduleResolution: Bundler`. Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`) for TypeORM compatibility.
- `strict: true` but `strictNullChecks: false` — be aware null/undefined checks aren't enforced despite `strict` mode.
- Only `tsconfig.json` exists (no separate build config) — it's used both for `typecheck` and by `tsdown` for the build. `include` is `src/**/*.ts` only; `test/` and the root config files are covered by eslint's `allowDefaultProject`, not by the tsconfig project.

## Tooling config files

- `eslint.config.ts` — flat config (loaded through `jiti`): `@eslint/js` recommended, `typescript-eslint` `recommendedTypeChecked`, `eslint-plugin-import` (+ TS resolver), `eslint-plugin-prettier/recommended`, and `eslint-plugin-one-line-import` (rule set to `error`). Most `no-unsafe-*` rules are turned off; `@typescript-eslint/no-unused-vars` is `error`.
- `prettier.config.ts` — `singleQuote: true`, `trailingComma: 'all'`.
- `vitest.config.ts` — node environment, `include: ['**/*.test.ts']`.
- `.npmrc` — `save-exact=true`, so dependency versions in `package.json` are pinned exactly (no `^`), except the intentional `^1.1.0` peer range.
- `pnpm-workspace.yaml` — only holds `allowBuilds` (currently `unrs-resolver`) to approve postinstall scripts non-interactively.
- `.npmignore` — the published tarball is `dist/` only (`files: ["dist"]` in `package.json`); `.npmignore` additionally excludes sources, tests, tooling configs, CI and AI-tooling files as a second layer of defense.
