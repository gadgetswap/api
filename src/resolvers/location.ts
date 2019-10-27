import { Args, Authorized, Mutation, Query, Resolver } from 'type-graphql'

import { Location } from '../models'
import { LocationService } from '../services'
import { CitiesArgs, CreateLocationArgs } from '../types/args'

@Resolver(Location)
export class LocationResolver {
  constructor(private readonly service: LocationService) {}

  @Query(() => [String])
  @Authorized()
  countries(): Promise<string[]> {
    return this.service.countries()
  }

  @Query(() => [Location])
  @Authorized()
  locations(@Args() { country }: CitiesArgs): Promise<Location[]> {
    return this.service.locations(country)
  }

  @Mutation(() => Location)
  @Authorized()
  createLocation(@Args() { data }: CreateLocationArgs): Promise<Location> {
    return this.service.createLocation(data)
  }
}
