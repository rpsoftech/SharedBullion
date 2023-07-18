import { Inject } from '@nestjs/common';
import { BullionId } from '@rps/bullion-interfaces';
import { LoggerFactory, MongoDbService } from '@rps/bullion-server-core';
import {
  BullionSiteInfoOptions,
  BullionSiteInfoRoot,
} from '@rps/bullion-validator-roots';
import {
  BullionSiteInfoFilter,
  BullionSiteInfoRepository,
} from '../../interface';

export const bullionSiteInfoCollection = 'BullionSiteInfo';

export type BullionSiteInfoDocument = BullionSiteInfoOptions & {
  _id: BullionId;
};

export class BullionSiteInfoMongoRepository extends BullionSiteInfoRepository {
  private readonly collection;
  private readonly logger;

  constructor(
    @Inject(MongoDbService) { db }: MongoDbService,
    @Inject(LoggerFactory) loggerFactory: LoggerFactory
  ) {
    super();
    this.collection = db.collection<BullionSiteInfoRoot>(
      bullionSiteInfoCollection
    );
    this.logger = loggerFactory.create(this.constructor.name);
  }

  async find(filter?: BullionSiteInfoFilter): Promise<BullionSiteInfoRoot[]> {
    const cursor = filter
      ? this.collection.find(filter)
      : this.collection.find();
    const users = await cursor.toArray();
    return users.map((user) => BullionSiteInfoRoot.fromJson(user));
  }

  async findByIds(ids: Array<BullionId>): Promise<BullionSiteInfoRoot[]> {
    const bullions = await this.collection
      .find({
        id: {
          $in: ids,
        },
      })
      .toArray();
    return bullions.map((bullion) => BullionSiteInfoRoot.fromJson(bullion));
  }

  async findOne(id: BullionId): Promise<BullionSiteInfoRoot | undefined> {
    const bullion = await this.collection.findOne({
      id,
    });
    return typeof bullion !== 'undefined' && bullion !== null
      ? BullionSiteInfoRoot.fromJson(bullion)
      : undefined;
  }

  async save(entity: BullionSiteInfoRoot): Promise<void> {
    const data = entity.toJson();

    await this.collection.updateOne(
      { id: entity.id },
      { $set: data },
      { upsert: true }
    );

    this.logger.debug(
      `Persisted GeneralUser (${entity.id}): ${JSON.stringify(data)}`
    );
  }
}