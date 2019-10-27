import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { Gadget, GadgetRequest, User } from '../models'
import { GadgetService } from '../services'
import { CreateGadgetArgs, GadgetArgs, RequestGadgetArgs } from '../types/args'

@Resolver(Gadget)
export class GadgetResolver {
  constructor(private readonly service: GadgetService) {}

  @Query(() => Gadget)
  @Authorized()
  gadget(@Args() { gadgetId }: GadgetArgs): Promise<Gadget> {
    return this.service.gadget(gadgetId)
  }

  @Query(() => [GadgetRequest])
  @Authorized(['gadget_owner'])
  gadgetRequests(@Args() { gadgetId }: GadgetArgs): Promise<GadgetRequest[]> {
    return this.service.gadgetRequests(gadgetId)
  }

  @Mutation(() => Gadget)
  @Authorized()
  createGadget(
    @Ctx('user') user: User,
    @Args() { data }: CreateGadgetArgs
  ): Promise<Gadget> {
    return this.service.createGadget(user, data)
  }

  @Mutation(() => GadgetRequest)
  @Authorized()
  requestGadget(
    @Ctx('user') user: User,
    @Args() { description, gadgetId }: RequestGadgetArgs
  ): Promise<GadgetRequest> {
    return this.service.requestGadget(user, gadgetId, description)
  }
}
