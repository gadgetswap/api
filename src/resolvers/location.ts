import { Authorized, Query, Resolver } from 'type-graphql'

import { Location } from '../models'
import { LocationService } from '../services'

@Resolver(Location)
export class LocationResolver {
  constructor(private readonly service: LocationService) {}

  @Query(() => [Location])
  @Authorized()
  locations(): Promise<Location[]> {
    return this.service.locations()
  }
}
