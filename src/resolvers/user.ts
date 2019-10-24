import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { User } from '../models'
import { UserService } from '../services'
import { LoginArgs, RegisterArgs } from '../types/args'
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
  login(@Args() { email, password }: LoginArgs): Promise<AuthResult> {
    return this.service.login(email, password)
  }

  @Mutation(() => AuthResult)
  register(@Args() { email, name, password }: RegisterArgs): Promise<
    AuthResult
  > {
    return this.service.register(name, email, password)
  }
}
