# Contributing

Thanks for taking the time. This is a small library, so the process is short.

## Prerequisites

- Node.js 24+ — the exact version lives in `.nvmrc` (`nvm use` picks it up).
- pnpm — pinned via `packageManager` in `package.json`, so `corepack enable` gives you the right version. Don't use npm or yarn; the lockfile is `pnpm-lock.yaml`.

## Getting set up

You don't need write access to the repository. Fork it, work on a branch, open a pull request.

```bash
gh repo fork rafikidota/serpens --clone
cd serpens
nvm use
corepack enable
pnpm install
git checkout -b feat/my-change
```

Branch names: `feat/…` for features, `fix/…` for bug fixes, `docs/…`, `chore/…`. Keep them short-lived — `main` is the only long-lived branch.

## Project layout

```
src/
  strategy/   SnakeNamingStrategy — the main product, extends TypeORM's DefaultNamingStrategy
  util/       standalone string-case converters (camelCase, snakeCase, titleCase), no TypeORM dependency
  index.ts    re-exports both barrels
test/         Vitest suite, one file per unit
```

Every directory re-exports through its own `index.ts`, and `src/index.ts` re-exports those barrels. When you add a file, export it from the subdirectory's `index.ts` too, or it won't reach consumers.

## Making a change

1. Add or update tests in `test/` — anything in `**/*.test.ts` is picked up.
2. Make the change.
3. Run the same checks CI runs:

```bash
pnpm typecheck   # tsc --noEmit
pnpm lint:check  # eslint, no auto-fix
pnpm test        # vitest run (pnpm test:watch while iterating)
pnpm build       # tsdown, dual ESM/CJS output to dist/
```

`pnpm lint` auto-fixes, `pnpm format` runs prettier. A husky pre-commit hook runs `lint-staged` (prettier, then eslint) over staged `.ts`/`.json` files, so most style issues get fixed for you before the commit lands.

Things worth knowing before you write code:

- **No new runtime dependencies.** The package ships with zero dependencies; `typeorm` is a peer dependency (`^1.1.0`) that consumers supply themselves. If a change needs a new dependency, open an issue first.
- `strict: true` but `strictNullChecks: false` in `tsconfig.json` — null and undefined checks aren't enforced by the compiler, so handle them explicitly where it matters.
- Prettier config is `singleQuote: true`, `trailingComma: 'all'`. Imports must fit on one line (`eslint-plugin-one-line-import`, set to `error`).
- Don't commit `dist/` — it's built in CI and only `dist/` ships in the published tarball.

## Commits

Conventional Commits with a gitmoji: `<type>: <emoji> <description>`.

```
feat: ✨ add kebabCase util
fix: 🔨 handle empty strings in snakeCase
docs: 📝 document the naming strategy overrides
chore: 🛠️ bump eslint to 10.8
```

Keep the subject in the imperative and under ~50 characters. Add a body when the "why" isn't obvious from the diff.

## Opening a pull request

Target `main`. Then:

- CI (`.github/workflows/ci.yml`) runs typecheck, lint, tests and build on every pull request.
- If this is your first contribution, the workflow run waits for a maintainer to approve it. That's a GitHub default for first-time contributors, not something you did wrong.
- `main` requires a pull request, a passing `test` check, and the branch to be up to date with `main` before merging. If `main` moved while your PR sat, rebase or merge it in.
- A maintainer merges it. Contributors can't merge their own pull requests.

## Releases

Maintainers only. `main` is tagged with `pnpm version <patch|minor|major>` and `git push --follow-tags`; the `v*` tag triggers `.github/workflows/publish.yml`, which reruns CI, checks that the tag matches `package.json`, and publishes to npm with provenance after manual approval. Nothing to do on your side — don't bump the version in a pull request.
