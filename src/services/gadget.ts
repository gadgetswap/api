import { Service } from 'typedi'

import {
  CommentModel,
  Gadget,
  GadgetModel,
  LocationModel,
  User
} from '../models'
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

  async gadgetsByUser(userId: string): Promise<Gadget[]> {
    const gadgets = await GadgetModel.find({
      user: userId
    }).sort({
      createdAt: -1
    })

    return gadgets
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

  async deleteGadget(gadgetId: string): Promise<boolean> {
    const gadget = await GadgetModel.findById(gadgetId)

    if (!gadget) {
      throw new Error('Gadget not found')
    }

    await CommentModel.deleteMany({
      gadget: gadgetId
    })

    // TODO: delete images

    await gadget.remove()

    return true
  }
}
