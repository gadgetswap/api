import { Authorized, Query, Resolver } from 'type-graphql'

import { Location, LocationModel } from '../models'

@Resolver(Location)
export class LocationResolver {
  @Query(() => [Location])
  @Authorized()
  async locations(): Promise<Location[]> {
    const locations = await LocationModel.find()

    return locations
  }
}
