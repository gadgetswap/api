import { Args, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'

import { Roles } from '../lib'
import { GadgetRequest, User } from '../models'
import { RequestService } from '../services'
import { RequestGadgetArgs, UpdateRequestArgs } from '../types/args'

@Resolver(GadgetRequest)
export class RequestResolver {
  constructor(private readonly service: RequestService) {}

  @Mutation(() => GadgetRequest)
  @Authorized()
  createRequest(
    @Ctx('user') user: User,
    @Args() { description, gadgetId }: RequestGadgetArgs
  ): Promise<GadgetRequest> {
    return this.service.createRequest(user, gadgetId, description)
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
