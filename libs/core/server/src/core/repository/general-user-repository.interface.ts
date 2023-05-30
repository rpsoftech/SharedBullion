import { GeneralUserRoot } from '@rps/bullion-validator-roots';
import { EntityNotFoundError, GeneralUserId } from '@rps/bullion-interfaces';

export abstract class GeneralUserRepository {
  abstract find(): Promise<GeneralUserRoot[]>;
  abstract findByIds(ids: Array<GeneralUserId>): Promise<GeneralUserRoot[]>;

  abstract findOne(id: GeneralUserId): Promise<GeneralUserRoot | undefined>;

  abstract save(entity: GeneralUserRoot): Promise<void>;

  async findOneOrFail(id: GeneralUserId): Promise<GeneralUserRoot> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new EntityNotFoundError({
        message: `${GeneralUserRoot.name} identified by serial ${id} not found`,
      });
    }

    return entity;
  }
}