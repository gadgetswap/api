import { Service } from 'typedi'

import { Location, LocationModel } from '../models'
import { CreateLocationInput } from '../types/input'

@Service()
export class LocationService {
  async countries(): Promise<string[]> {
    const [{ countries }] = await LocationModel.aggregate([
      {
        $group: {
          _id: null,
          countries: {
            $addToSet: '$country'
          }
        }
      }
    ])

    return countries.sort()
  }

  async locations(country: string): Promise<Location[]> {
    const locations = await LocationModel.find({
      country
    })

    return locations
  }

  async createLocation({
    city,
    country
  }: CreateLocationInput): Promise<Location> {
    const location = await LocationModel.create({
      city,
      country
    })

    return location
  }
}
