import { Args, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'

import { Comment, User } from '../models'
import { CommentService } from '../services'
import { CreateCommentArgs } from '../types/args'

@Resolver(Comment)
export class CommentResolver {
  constructor(private readonly service: CommentService) {}

  @Mutation(() => Comment)
  @Authorized()
  createComment(
    @Ctx('user') user: User,
    @Args() { body, gadgetId }: CreateCommentArgs
  ): Promise<Comment> {
    return this.service.createComment(user, gadgetId, body)
  }
}
