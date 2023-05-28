import { Inject, Injectable, Optional } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Db, OptionalUnlessRequiredId } from 'mongodb';
import { resolve } from 'path';
import * as uuid from 'uuid';

import { LoggerFactory } from '../logger';
import { MongoDbService } from '../mongo';
import { FIXTURES_PATH, FixturesPath } from './fixtures-path.token';
import { hasProp } from '@rps/bullion-interfaces';


@Injectable()
export class FixtureService {
  private readonly db:Db;
  private readonly logger;

  constructor(
    { db }: MongoDbService,
    loggerFactory: LoggerFactory,
    @Optional()
    @Inject(FIXTURES_PATH)
    private readonly fixturesPath: FixturesPath = resolve(
      __dirname,
      'assets',
      'fixtures'
    )
  ) {
    this.db = db;
    this.logger = loggerFactory.create(this.constructor.name);
  }

  async loadJson<T>(path: string) {
    const fileBuffer = await readFile(resolve(this.fixturesPath, path));

    return JSON.parse(fileBuffer.toString()).data as Array<T>;
  }

  async seedFixtures<
    Fixture extends { id: string },
    UuidDocument extends Fixture & { _id: string }
  >(collectionName: string, path: string, dropCollection = true) {
    const fixtures = await this.loadJson<Fixture>(path);
    const collection = this.db.collection<UuidDocument>(collectionName);
    if (dropCollection) {
      this.logger.verbose(`dropping ${collectionName} collection`);
      try {
        await collection.drop();
      } catch (error) {
        this.logger.verbose(`failed to drop ${collectionName} collection`);
      }
    }
    this.logger.verbose(
      `Seeding ${fixtures.length} entities from ${path} into ${collectionName}`
    );

    const documents = fixtures.map(
      (data) =>
        ({
          ...data,
          _id: uuid.v4(),
        } as OptionalUnlessRequiredId<UuidDocument>)
    );

    try {
      await collection.insertMany(documents, { ordered: false });
    } catch (error) {
      if (
        error !== null &&
        typeof error === 'object' &&
        hasProp(error, 'code')
      ) {
        /**
         * @see https://github.com/mongodb/mongo/blob/master/src/mongo/base/error_codes.yml
         */
        if (error.code === 11000) {
          const ids = documents.map(({ id }) => id);
          this.logger.debug(
            `Documents (${ids.join(', ')}) already exist in ${collectionName}`
          );
          return;
        }
      }

      this.logger.error(error);
    }
  }
}
