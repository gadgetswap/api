import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { createToken, signPassword, verifyPassword } from '../auth'
import { User, UserModel } from '../models'
import { AuthResult } from '../types'

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  @Authorized()
  profile(@Ctx('user') user: User): User {
    return user
  }
}

@Resolver(AuthResult)
export class AuthResolver {
  @Mutation(() => AuthResult)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<AuthResult> {
    const user = await UserModel.findOne({
      email
    })

    if (!user) {
      throw new Error('User not found')
    }

    const correct = await verifyPassword(user, password)

    if (!correct) {
      throw new Error('Password incorrect')
    }

    const token = createToken(user)

    return {
      token,
      user
    }
  }

  @Mutation(() => AuthResult)
  async register(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<AuthResult> {
    const user = await UserModel.create({
      email,
      name,
      password: await signPassword(password)
    })

    const token = createToken(user)

    return {
      token,
      user
    }
  }
}
