import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { Gadget, User } from '../models'
import { GadgetService } from '../services'
import { CreateGadgetArgs, GadgetArgs } from '../types/args'

@Resolver(Gadget)
export class GadgetResolver {
  constructor(private readonly service: GadgetService) {}

  @Query(() => Gadget)
  @Authorized()
  gadget(@Args() { gadgetId }: GadgetArgs): Promise<Gadget> {
    return this.service.gadget(gadgetId)
  }

  @Mutation(() => Gadget)
  @Authorized()
  createGadget(
    @Ctx('user') user: User,
    @Args() { data }: CreateGadgetArgs
  ): Promise<Gadget> {
    return this.service.createGadget(user, data)
  }
}
