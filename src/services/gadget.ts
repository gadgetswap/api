import { Service } from 'typedi'

import { helpers } from '../lib'
import {
  Gadget,
  GadgetModel,
  GadgetRequest,
  LocationModel,
  User
} from '../models'
import { GadgetRequestStatus, GadgetStatus } from '../types/graphql'
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
      .select('-requests')
      .sort({
        createdAt: -1
      })

    return gadgets
  }

  async gadget(gadgetId: string): Promise<Gadget> {
    const gadget = await GadgetModel.findById(gadgetId)
      .populate('location')
      .select('-requests')

    if (!gadget) {
      throw new Error('Gadget not found')
    }

    return gadget
  }

  async gadgetRequests(gadgetId: string): Promise<GadgetRequest[]> {
    const gadget = await GadgetModel.findById(gadgetId).populate(
      'requests.user'
    )

    if (!gadget) {
      throw new Error('Gadget not found')
    }

    return gadget.requests
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

  async requestGadget(
    user: User,
    gadgetId: string,
    description: string
  ): Promise<GadgetRequest> {
    const gadget = await GadgetModel.findById(gadgetId)

    if (!gadget) {
      throw new Error('Gadget not found')
    }

    if (gadget.status === GadgetStatus.NOT_AVAILABLE) {
      throw new Error('Gadget not available anymore')
    }

    if (helpers.equals(user.id, gadget.user)) {
      throw new Error('You cannot request your own gadget')
    }

    const exists = gadget.requests.find(request =>
      helpers.equals(user.id, request.user)
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

    const request = gadget.requests[length - 1]

    await GadgetModel.populate(request, {
      path: 'user'
    })

    return request
  }

  async updateRequest(
    gadgetId: string,
    requestId: string,
    status: GadgetRequestStatus
  ): Promise<boolean> {
    const gadget = await GadgetModel.findById(gadgetId)

    if (!gadget) {
      throw new Error('Gadget not found')
    }

    if (gadget.status === GadgetStatus.NOT_AVAILABLE) {
      throw new Error('Gadget not available anymore')
    }

    const request = gadget.requests.find(request => request.id === requestId)

    if (!request) {
      throw new Error('Request not found')
    }

    request.status = status

    const approved = gadget.requests.filter(
      request => request.status === GadgetRequestStatus.APPROVED
    )

    if (approved.length === gadget.quantity) {
      gadget.status = GadgetStatus.NOT_AVAILABLE
    }

    await gadget.save()

    return true
  }
}
