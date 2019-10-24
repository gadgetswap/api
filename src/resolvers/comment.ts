import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'

import { Comment, User } from '../models'
import { CommentService } from '../services'

@Resolver(Comment)
export class CommentResolver {
  constructor(private readonly service: CommentService) {}

  @Mutation(() => Comment)
  @Authorized()
  createComment(
    @Ctx('user') user: User,
    @Arg('gadgetId') gadgetId: string,
    @Arg('body') body: string
  ): Promise<Comment> {
    return this.service.createComment(user, gadgetId, body)
  }
}
