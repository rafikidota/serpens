# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@rafikidota/serpens` — a small npm library providing a TypeORM `SnakeNamingStrategy` plus string-case utilities (camelCase, snakeCase, titleCase). Published to npm, consumed by other projects as a TypeORM `namingStrategy`.

## Commands

- `npm run build` — compile `src/` to `dist/` via `tsc -p tsconfig.json` (runs `rimraf dist` first via `prebuild`)
- `npm run lint` — `eslint --debug . --fix`
- `npm run format` — `prettier --write "**/*.ts"`
- Package manager is pnpm (`pnpm-lock.yaml`), despite npm-named scripts.
- No test suite exists in this repo currently.

Pre-commit runs `lint-staged` via husky (`.husky/pre-commit`): staged `*.ts` files get `prettier --write` then `eslint`.

## Architecture

Two independent export groups from `src/index.ts`:

- `src/strategy/` — `SnakeNamingStrategy` (`snake.ts`), extending TypeORM's `DefaultNamingStrategy` and implementing `NamingStrategyInterface`. Converts table/column/relation names to snake_case using the `util` snake-case function. This is the library's main product.
- `src/util/` — standalone string-case converters (`camel-case.ts`, `snake-case.ts`, `title-case.ts`), independent of TypeORM, used internally by `strategy` and also exported publicly.

Each subdirectory re-exports through its own `index.ts`; `src/index.ts` re-exports both barrels. When adding a new case-conversion util or naming strategy, follow this barrel pattern (add the file, then export it from the subdirectory's `index.ts`).

TypeORM is a `devDependency`, not a runtime `dependency` — consumers must supply their own TypeORM install (peer-dependency style, though not formally declared as one).

## TypeScript config notes

- Target `ES2021`, `CommonJS` modules, decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`) for TypeORM compatibility.
- `strict: true` but `strictNullChecks: false` — be aware null/undefined checks aren't enforced despite `strict` mode.
- `tsconfig.build.json` extends the base config, excluding `dist`.
