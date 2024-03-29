import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  BullionSiteInfoRepoProvider,
  GeneralUserRepoProvider,
  GeneralUserReqRepoProvider,
} from '@bs/repo';
import { AuthServerAppModuleOptions } from '../../core/token.module';
import {
  FixturesMongoModule,
  MongoRepositoryLocalModule,
  MongoRepositoryProductionModule,
  RedisRepositoryLocalModule,
  RedisRepositoryProductionModule,
} from '@bs/core';
import { resolve } from 'path';

const repositoryPorvider = [
  GeneralUserRepoProvider,
  GeneralUserReqRepoProvider,
  BullionSiteInfoRepoProvider,
];

@Global()
@Module({
  providers: [...repositoryPorvider],
  exports: [...repositoryPorvider],
})
class RepoServiceModule {}
@Global()
@Module({
  imports: [RepoServiceModule],
})
export class RepositoryModule {
  static register({ appEnv }: AuthServerAppModuleOptions): DynamicModule {
    let imports: DynamicModule['imports'] = [];
    switch (appEnv) {
      case 'ci':
      case 'local':
        imports = [
          ...imports,
          MongoRepositoryLocalModule,
          RedisRepositoryLocalModule,
          FixturesMongoModule.forRoot(resolve(__dirname, 'assets', 'fixtures')),
        ];
        break;
      case 'production':
        imports = [
          ...imports,
          // FixturesMongoModule.forRoot(resolve(__dirname, 'assets', 'fixtures')),
          MongoRepositoryProductionModule.forRoot({
            urlKey: 'AUTH_DB_URL',
            tlsCaKey: 'AUTH_DB_TLS_CA',
          }),
          RedisRepositoryProductionModule.forRoot({
            urlKey: 'AUTH_REDIS_URL',
            userNameKey: 'AUTH_REDIS_USERNAME',
            passwordKey: 'AUTH_REDIS_PASSWORD',
          }),
        ];
        break;
    }

    return {
      module: RepositoryModule,
      imports,
    };
  }
}
