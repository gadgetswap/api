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

import { helpers } from '../lib'
import { Gadget, User } from '../models'
import { GadgetService } from '../services'
import { CreateGadgetArgs, GadgetArgs, GadgetsArgs } from '../types/args'

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

  @Mutation(() => Gadget)
  @Authorized()
  createGadget(
    @Ctx('user') user: User,
    @Args() { data, location }: CreateGadgetArgs
  ): Promise<Gadget> {
    return this.service.createGadget(user, data, location)
  }

  @FieldResolver(() => [String])
  images(@Root() gadget: DocumentType<Gadget>): string[] {
    return gadget.images.map(image => `${AWS_S3_URI}/images/${image}`)
  }

  @FieldResolver(() => Boolean)
  isRequested(
    @Ctx('user') user: User,
    @Root() gadget: DocumentType<Gadget>
  ): boolean {
    return !!gadget.requests.find(request =>
      helpers.equals(user.id, request.user)
    )
  }
}
