import { Service } from 'typedi'

import { auth } from '../lib'
import { UserModel } from '../models'
import { AuthResult } from '../types/graphql'

@Service()
export class UserService {
  async login(email: string, password: string): Promise<AuthResult> {
    const user = await UserModel.findOne({
      email
    })

    if (!user) {
      throw new Error('User not found')
    }

    const correct = await auth.verifyPassword(user, password)

    if (!correct) {
      throw new Error('Password incorrect')
    }

    const token = auth.createToken(user)

    return {
      token,
      user
    }
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    const user = await UserModel.create({
      email,
      name,
      password: await auth.signPassword(password)
    })

    const token = auth.createToken(user)

    return {
      token,
      user
    }
  }
}
