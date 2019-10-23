import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'

import { Gadget, GadgetModel, LocationModel, User } from '../models'
import { GadgetInput } from '../types/input'

@Resolver(Gadget)
export class GadgetResolver {
  @Mutation(() => Gadget)
  @Authorized()
  async createGadget(
    @Ctx('user') user: User,
    @Arg('data') data: GadgetInput
  ): Promise<Gadget> {
    const gadget = await GadgetModel.create({
      ...data,
      user
    })

    const { city, country } = data

    await LocationModel.findOneAndUpdate(
      {
        city,
        country
      },
      {
        city,
        country
      },
      {
        upsert: true
      }
    )

    return gadget
  }
}
