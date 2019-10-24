import { Service } from 'typedi'

import { Gadget, GadgetModel, LocationModel, User } from '../models'
import { GadgetInput } from '../types/input'

@Service()
export class GadgetService {
  async gadget(gadgetId: string): Promise<Gadget> {
    const gadget = await GadgetModel.findById(gadgetId).populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    })

    if (!gadget) {
      throw new Error('Gadget not found')
    }

    return gadget
  }

  async createGadget(user: User, data: GadgetInput): Promise<Gadget> {
    const gadget = await GadgetModel.create({
      ...data,
      user
    })

    const { city, country } = data

    await LocationModel.findOneAndUpdate(
      {
        city,
        country
      },
      {
        city,
        country
      },
      {
        upsert: true
      }
    )

    return gadget
  }
}
