# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@rafikidota/serpens` — a small npm library providing a TypeORM `SnakeNamingStrategy` plus string-case utilities (camelCase, snakeCase, titleCase). Published to npm, consumed by other projects as a TypeORM `namingStrategy`.

## Commands

- `npm run build` — bundle `src/` to `dist/` via `tsdown` (see `tsdown.config.ts`): dual CJS/ESM output (`dist/index.cjs`, `dist/index.mjs`) plus `.d.cts`/`.d.mts` declarations, with sourcemaps. No `prebuild` step; `tsdown`'s `clean: true` handles clearing `dist/` itself.
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — `eslint --debug . --fix`
- `npm run lint:check` — `eslint .` (no `--fix`, no `--debug`); this is the CI/publish-safe variant, since `--fix` would auto-mutate the checkout.
- `npm run format` — `prettier --write "**/*.ts"`
- `npm test` — runs the Vitest suite (`vitest run`); `npm run test:watch` for watch mode.
- Package manager is pnpm (`pnpm-lock.yaml`), despite npm-named scripts.
- 18 Vitest tests live in `test/`: `camel-case.test.ts`, `snake-case.test.ts`, `title-case.test.ts`, `snake.test.ts`.

Pre-commit runs `lint-staged` via husky (`.husky/pre-commit`): staged `*.ts` files get `prettier --write` then `eslint`.

Two GitHub Actions workflows: `ci.yml` (typecheck/lint:check/test/build on push/PR to `main`) and `publish.yml` (typecheck/lint:check/test/build/`npm publish` on `v*` tag push).

## Architecture

Two independent export groups from `src/index.ts`:

- `src/strategy/` — `SnakeNamingStrategy` (`snake.ts`), extending TypeORM's `DefaultNamingStrategy` and implementing `NamingStrategyInterface`. Converts table/column/relation names to snake_case using the `util` snake-case function. This is the library's main product.
- `src/util/` — standalone string-case converters (`camel-case.ts`, `snake-case.ts`, `title-case.ts`), independent of TypeORM, used internally by `strategy` and also exported publicly.

Each subdirectory re-exports through its own `index.ts`; `src/index.ts` re-exports both barrels. When adding a new case-conversion util or naming strategy, follow this barrel pattern (add the file, then export it from the subdirectory's `index.ts`).

TypeORM is declared as a `peerDependency` (`"typeorm": "^0.3.0"`), not a runtime `dependency` — consumers must supply their own TypeORM install; it's also present as a `devDependency` for local development/tests.

## TypeScript config notes

- Target `ES2021`, `CommonJS` modules, decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`) for TypeORM compatibility.
- `strict: true` but `strictNullChecks: false` — be aware null/undefined checks aren't enforced despite `strict` mode.
- Only `tsconfig.json` exists (no separate build config) — it's used both for `typecheck` and by `tsdown` for the build.
