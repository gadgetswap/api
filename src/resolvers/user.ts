import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { User } from '../models'
import { UserService } from '../services'
import { AuthResult } from '../types/graphql'

@Resolver(User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(() => User)
  @Authorized()
  profile(@Ctx('user') user: User): User {
    return user
  }

  @Mutation(() => AuthResult)
  login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<AuthResult> {
    return this.service.login(email, password)
  }

  @Mutation(() => AuthResult)
  register(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<AuthResult> {
    return this.service.register(name, email, password)
  }
}
