import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { Roles } from '../lib'
import { Gadget, GadgetRequest, User } from '../models'
import { GadgetService } from '../services'
import {
  CreateGadgetArgs,
  GadgetArgs,
  GadgetsArgs,
  RequestGadgetArgs,
  UpdateRequestArgs
} from '../types/args'

@Resolver(Gadget)
export class GadgetResolver {
  constructor(private readonly service: GadgetService) {}

  @Query(() => [Gadget])
  @Authorized()
  gadgets(@Args() { locationId }: GadgetsArgs): Promise<Gadget[]> {
    return this.service.gadgets(locationId)
  }

  @Query(() => Gadget)
  @Authorized()
  gadget(@Args() { gadgetId }: GadgetArgs): Promise<Gadget> {
    return this.service.gadget(gadgetId)
  }

  @Query(() => [GadgetRequest])
  @Authorized([Roles.OWNER])
  gadgetRequests(@Args() { gadgetId }: GadgetArgs): Promise<GadgetRequest[]> {
    return this.service.gadgetRequests(gadgetId)
  }

  @Mutation(() => Gadget)
  @Authorized()
  createGadget(
    @Ctx('user') user: User,
    @Args() { data, locationId }: CreateGadgetArgs
  ): Promise<Gadget> {
    return this.service.createGadget(user, locationId, data)
  }

  @Mutation(() => GadgetRequest)
  @Authorized()
  requestGadget(
    @Ctx('user') user: User,
    @Args() { description, gadgetId }: RequestGadgetArgs
  ): Promise<GadgetRequest> {
    return this.service.requestGadget(user, gadgetId, description)
  }

  @Mutation(() => Boolean)
  @Authorized([Roles.OWNER])
  updateRequest(@Args()
  {
    gadgetId,
    requestId,
    status
  }: UpdateRequestArgs): Promise<boolean> {
    return this.service.updateRequest(gadgetId, requestId, status)
  }
}
