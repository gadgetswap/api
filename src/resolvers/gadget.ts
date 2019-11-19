const { AWS_S3_URI } = process.env

import { DocumentType } from '@typegoose/typegoose'
import {
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql'

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
  gadgets(@Args() { locationId }: GadgetsArgs): Promise<Gadget[]> {
    return this.service.gadgets(locationId)
  }

  @Query(() => Gadget)
  gadget(@Args() { gadgetId }: GadgetArgs): Promise<Gadget> {
    return this.service.gadget(gadgetId)
  }

  @Query(() => [GadgetRequest])
  @Authorized(Roles.OWNER)
  gadgetRequests(@Args() { gadgetId }: GadgetArgs): Promise<GadgetRequest[]> {
    return this.service.gadgetRequests(gadgetId)
  }

  @Mutation(() => Gadget)
  @Authorized()
  createGadget(
    @Ctx('user') user: User,
    @Args() { data, location }: CreateGadgetArgs
  ): Promise<Gadget> {
    return this.service.createGadget(user, data, location)
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

  @FieldResolver(() => [String])
  images(@Root() gadget: DocumentType<Gadget>): string[] {
    return gadget.images.map(image => `${AWS_S3_URI}/images/${image}`)
  }
}
