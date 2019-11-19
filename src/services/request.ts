import { Service } from 'typedi'

import { helpers } from '../lib'
import { GadgetModel, GadgetRequest, User } from '../models'
import { GadgetRequestStatus, GadgetStatus } from '../types/graphql'

@Service()
export class RequestService {
  async createRequest(
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

    if (
      status === GadgetRequestStatus.APPROVED &&
      gadget.status === GadgetStatus.NOT_AVAILABLE
    ) {
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
    } else {
      gadget.status = GadgetStatus.AVAILABLE
    }

    await gadget.save()

    return true
  }
}
