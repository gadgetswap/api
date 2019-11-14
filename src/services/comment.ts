import { Service } from 'typedi'

import { Comment, CommentModel, User } from '../models'

@Service()
export class CommentService {
  async comments(gadgetId: string): Promise<Comment[]> {
    return CommentModel.find({
      gadget: gadgetId
    })
      .populate('user')
      .sort({
        createdAt: 1
      })
  }

  async createComment(
    user: User,
    gadgetId: string,
    body: string
  ): Promise<Comment> {
    const comment = await CommentModel.create({
      body,
      gadget: gadgetId,
      user
    })

    return comment
  }
}
