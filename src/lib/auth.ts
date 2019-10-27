const { SALT_ROUNDS, TOKEN_SECRET } = process.env

import { AuthenticationError } from 'apollo-server'
import { compare, hash } from 'bcrypt'
import { Request } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { get } from 'lodash'
import { AuthChecker } from 'type-graphql'

import { helpers } from '../lib'
import { GadgetModel, User, UserModel } from '../models'
import { Context } from '../types'

export enum Roles {
  OWNER
}

export const authChecker: AuthChecker<Context, number> = async (
  { args: { gadgetId }, context: { user } },
  roles
): Promise<boolean> => {
  if (user && roles.includes(Roles.OWNER)) {
    const gadget = await GadgetModel.findById(gadgetId)

    if (gadget) {
      return helpers.equals(user.id, gadget.user)
    }
  }

  return !!user
}

class Auth {
  createToken(user: User): string {
    return sign(
      {
        userId: user.id
      },
      String(TOKEN_SECRET)
    )
  }

  signPassword(password: string): Promise<string> {
    return hash(password, Number(SALT_ROUNDS))
  }

  verifyPassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.password)
  }

  async getUser(req: Request): Promise<User | undefined> {
    const auth = req.get('authorization')

    if (!auth) {
      return
    }

    const token = auth.substr(7)

    if (!token) {
      throw new AuthenticationError('Invalid token')
    }

    const data = verify(token, TOKEN_SECRET as string)

    const id = get(data, 'userId')

    if (!id) {
      throw new AuthenticationError('Invalid token')
    }

    const user = await UserModel.findById(id).select('+password')

    if (!user) {
      throw new AuthenticationError('User not found')
    }

    return user
  }
}

export const auth = new Auth()
