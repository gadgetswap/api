import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { Gadget, GadgetModel, LocationModel, User } from '../models'
import { GadgetInput } from '../types/input'

@Resolver(Gadget)
export class GadgetResolver {
  @Query(() => Gadget)
  @Authorized()
  async gadget(@Arg('gadgetId') gadgetId: string): Promise<Gadget> {
    const gadget = await GadgetModel.findById(gadgetId).populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    })

    if (!gadget) {
      throw new Error('Gadget not found')
    }

    return gadget
  }

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
