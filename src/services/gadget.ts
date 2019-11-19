import { Service } from 'typedi'

import { Gadget, GadgetModel, LocationModel, User } from '../models'
import { CreateGadgetInput, CreateLocationInput } from '../types/input'

@Service()
export class GadgetService {
  async gadgets(locationId?: string): Promise<Gadget[]> {
    const options: any = {}

    if (locationId) {
      options.location = locationId
    }

    const gadgets = await GadgetModel.find(options)
      .populate('location')
      .populate('requests.user')
      .populate('user')
      .sort({
        createdAt: -1
      })

    return gadgets
  }

  async gadget(gadgetId: string): Promise<Gadget> {
    const gadget = await GadgetModel.findById(gadgetId)
      .populate('location')
      .populate('user')

    if (!gadget) {
      throw new Error('Gadget not found')
    }

    return gadget
  }

  async createGadget(
    user: User,
    data: CreateGadgetInput,
    { city, country }: CreateLocationInput
  ): Promise<Gadget> {
    const location = await LocationModel.findOneAndUpdate(
      {
        city,
        country
      },
      {
        city,
        country
      },
      {
        new: true,
        upsert: true
      }
    )

    const gadget = await GadgetModel.create({
      ...data,
      location,
      user
    })

    return gadget
  }
}
