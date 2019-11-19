import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { Roles } from '../lib'
import { GadgetRequest, User } from '../models'
import { RequestService } from '../services'
import { GadgetArgs, RequestGadgetArgs, UpdateRequestArgs } from '../types/args'

@Resolver(GadgetRequest)
export class RequestResolver {
  constructor(private readonly service: RequestService) {}

  @Query(() => [GadgetRequest])
  @Authorized(Roles.OWNER)
  requests(@Ctx('user') user: User): Promise<GadgetRequest[]> {
    return this.service.requests(user.id)
  }

  @Query(() => [GadgetRequest])
  @Authorized(Roles.OWNER)
  gadgetRequests(@Args() { gadgetId }: GadgetArgs): Promise<GadgetRequest[]> {
    return this.service.gadgetRequests(gadgetId)
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
  @Authorized(Roles.OWNER)
  updateRequest(
    @Args()
    { gadgetId, requestId, status }: UpdateRequestArgs
  ): Promise<boolean> {
    return this.service.updateRequest(gadgetId, requestId, status)
  }
}
