# TypeORM Snake Naming Strategy

Sometimes, the best way to solve your own problems is to help someone else.

## Using Snake Naming Strategy with TypeORM

The following TypeScript code snippet illustrates an example of using this library with TypeORM.


```ts
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
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

CI (GitHub Actions) runs typecheck, lint, test and build on every push/PR. Published output ships both CommonJS and ESM builds via `exports` in `package.json`.

## Additional Resources
- [TypeORM Documentation](https://typeorm.io/)