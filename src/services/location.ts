import { Service } from 'typedi'

import { Location, LocationModel } from '../models'

@Service()
export class LocationService {
  async locations(): Promise<Location[]> {
    const locations = await LocationModel.find()

    return locations
  }
}
