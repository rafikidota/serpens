# TypeORM Snake Naming Strategy

Sometimes, the best way to solve your own problems is to help someone else.

`@rafikidota/serpens` ships a TypeORM `SnakeNamingStrategy` plus three standalone string-case utilities (`camelCase`, `snakeCase`, `titleCase`) you can use independently of TypeORM.

## Installation

```bash
npm install @rafikidota/serpens typeorm
# or
pnpm add @rafikidota/serpens typeorm
```

Requirements:

- `typeorm` `^1.1.0` — peer dependency, bring your own install.
- Node.js 24+ (the version used in CI, see `.nvmrc`).

The package is published as ESM-first with a dual build: `import` resolves to `dist/index.mjs`, `require` to `dist/index.cjs`, each with its own type declarations.

## Using SnakeNamingStrategy with TypeORM

```ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from '@rafikidota/serpens';

const config: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password: 'postgres',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
};

export default new DataSource(config);
```

With this strategy applied, an entity like:

```ts
@Entity()
class UserProfile {
  @Column()
  firstName: string;
}
```

maps to table `user_profile`, column `first_name`.

The strategy overrides three members of TypeORM's `DefaultNamingStrategy`:

| Member | Behaviour |
| --- | --- |
| `tableName` | Explicit `customName` wins, otherwise `snakeCase(className)` |
| `columnName` | Joins embedded prefixes with the column name, then snake-cases the result |
| `relationName` | `snakeCase(propertyName)` |

Everything else falls back to `DefaultNamingStrategy` (index names, foreign keys, join tables, etc.).

## String-case utilities

The same conversion helpers used internally by `SnakeNamingStrategy` are exported for standalone use — no TypeORM required.

```ts
import { camelCase, snakeCase, titleCase } from '@rafikidota/serpens';

snakeCase('firstName');           // 'first_name'
snakeCase('UserHTTPServer');       // 'user_http_server'

camelCase('first_name');          // 'firstName'
camelCase('first_name', true);    // 'FirstName'

titleCase('first name');          // 'First Name'
```

## Development

This package uses pnpm (version pinned via `packageManager` in `package.json`), Vitest and tsdown.

```bash
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm test        # run the test suite (pnpm test:watch for watch mode)
pnpm lint        # lint and auto-fix
pnpm lint:check  # lint without fixing (CI variant)
pnpm format      # prettier --write
pnpm build       # build dual ESM/CJS output to dist/
```

A husky pre-commit hook runs `lint-staged` over staged `.ts`/`.json` files (prettier, then eslint).

## Branching

`main` is the only long-lived branch. Work on a short-lived branch (`feat/…`, `fix/…`), open a pull request against `main`, and merge once CI is green. Releases are cut from `main` by pushing a `v*` tag.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor workflow.

## Releasing

CI (GitHub Actions) runs typecheck, lint, test and build on every pull request and on pushes to any branch other than `main`. `main` itself is not in the push trigger: its commits already ran CI on their pull request, and a release would otherwise run CI twice — once for the version commit, once through the publish workflow.

To cut a release:

```bash
pnpm version patch         # or minor / major — updates package.json, commits, tags
git push --follow-tags     # pushing the v* tag triggers the publish workflow
```

Pushing a `v*` tag runs three jobs:

| Job | Does |
| --- | --- |
| `ci` | Reruns the full CI workflow as a reusable workflow |
| `guard` | Fails if the tag doesn't match `package.json`, then resolves the npm dist-tag — prereleases go to `next`, stable versions to `latest` |
| `publish` | Waits for maintainer approval, then publishes |

The publish job runs in the `release` environment, so it pauses for manual approval with the CI and guard results already visible. It publishes with provenance via OIDC trusted publishing — no npm token secret involved — and only `dist/` is included in the tarball.

Use `pnpm version` rather than editing `package.json` by hand: it keeps the tag and the version in sync, which is what `guard` checks. The dist-tag matters because a trusted-publishing token cannot change dist-tags after the fact, so a mistagged prerelease would stay on `latest` permanently.

## Additional Resources

- [TypeORM Documentation](https://typeorm.io/)
