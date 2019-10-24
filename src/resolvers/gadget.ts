import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { Gadget, User } from '../models'
import { GadgetService } from '../services'
import { GadgetInput } from '../types/input'

@Resolver(Gadget)
export class GadgetResolver {
  constructor(private readonly service: GadgetService) {}

  @Query(() => Gadget)
  @Authorized()
  gadget(@Arg('gadgetId') gadgetId: string): Promise<Gadget> {
    return this.service.gadget(gadgetId)
  }

  @Mutation(() => Gadget)
  @Authorized()
  createGadget(
    @Ctx('user') user: User,
    @Arg('data') data: GadgetInput
  ): Promise<Gadget> {
    return this.service.createGadget(user, data)
  }
}
