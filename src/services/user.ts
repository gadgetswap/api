import { Service } from 'typedi'

import { createToken, signPassword, verifyPassword } from '../auth'
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

  async register(
    name: string,
    email: string,
    password: string
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
