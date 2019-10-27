import { DocumentType } from '@typegoose/typegoose'
import { Service } from 'typedi'

import {
  Gadget,
  GadgetModel,
  GadgetRequest,
  LocationModel,
  User
} from '../models'
import { CreateGadgetInput } from '../types/input'

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

  async createGadget(user: User, data: CreateGadgetInput): Promise<Gadget> {
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

  async requestGadget(
    user: User,
    gadgetId: string,
    description: string
  ): Promise<GadgetRequest> {
    const gadget = await GadgetModel.findById(gadgetId)

    if (!gadget) {
      throw new Error('Gadget not found')
    }

    // const exists = gadget.requests.find(request =>
    //   (user as DocumentType<User>)._id.equals(request.user)
    // ) as DocumentType<GadgetRequest>

    const exists = gadget.requests.find(request =>
      user._id.equals(request.user)
    )

    if (exists) {
      await GadgetModel.populate(exists, {
        path: 'user'
      })

      return exists
    }

    const length = gadget.requests.push({
      description,
      user
    } as GadgetRequest)

    await gadget.save()

    const request = gadget.requests[length - 1] as DocumentType<GadgetRequest>

    await GadgetModel.populate(request, {
      path: 'user'
    })

    return request
  }
}
