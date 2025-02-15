# TypeORM Snake Naming Strategy

Sometimes, the best way to solve your own problems is to help someone else.

## Using Snake Naming Strategy with TypeORM

The following TypeScript code snippet illustrates an example of using this library with TypeORM.


```ts
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from '@rafikidota/typeorm-snake-naming-strategy';

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


## Additional Resources
- [TypeORM Documentation](https://typeorm.io/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Nestjs Iroh example on GitHub](https://github.com/rafikidota/nestjs-iroh/)