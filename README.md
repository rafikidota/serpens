# TypeORM Snake Naming Strategy

Sometimes, the best way to solve your own problems is to help someone else.

`@rafikidota/serpens` ships a TypeORM `SnakeNamingStrategy` plus three standalone string-case utilities (`camelCase`, `snakeCase`, `titleCase`) you can use independently of TypeORM.

## Installation

```bash
npm install @rafikidota/serpens typeorm
# or
pnpm add @rafikidota/serpens typeorm
```

`typeorm` is a peer dependency — bring your own install (`^0.3.0`).

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

## Prerequisites

Before using this library, ensure you have the following:
- TypeORM configured
- Necessary dependencies installed

## Development

This package uses pnpm, Vitest and tsdown.

```bash
pnpm install
pnpm typecheck  # tsc --noEmit
pnpm test       # run the test suite
pnpm lint       # lint and auto-fix
pnpm build      # build dual ESM/CJS output to dist/
```

CI (GitHub Actions) runs typecheck, lint, test and build on every push/PR. A separate workflow publishes to npm on `v*` tags. Published output ships both CommonJS and ESM builds via `exports` in `package.json`.

## Additional Resources
- [TypeORM Documentation](https://typeorm.io/)
