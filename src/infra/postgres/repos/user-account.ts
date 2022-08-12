import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email })
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    let resultId: string
    if (!id) {
      const pgUser = await pgUserRepo.save({
        email,
        name,
        facebookId
      })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await pgUserRepo.update({
        id: parseInt(id)
      }, {
        name: name,
        facebookId: facebookId
      })
    }
    return { id: resultId }
  }
}
