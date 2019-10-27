const { SALT_ROUNDS, TOKEN_SECRET } = process.env

import { AuthenticationError } from 'apollo-server'
import { compare, hash } from 'bcrypt'
import { Request } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { get } from 'lodash'
import { AuthChecker } from 'type-graphql'

import { helpers } from './lib'
import { GadgetModel, User, UserModel } from './models'
import { Context } from './types'

export enum Roles {
  OWNER = 'OWNER'
}

export const authChecker: AuthChecker<Context> = async (
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

export const createToken = (user: User): string =>
  sign(
    {
      userId: user.id
    },
    String(TOKEN_SECRET)
  )

export const getUser = async (req: Request): Promise<User | undefined> => {
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

export const signPassword = (password: string): Promise<string> =>
  hash(password, Number(SALT_ROUNDS))

export const verifyPassword = (
  user: User,
  password: string
): Promise<boolean> => compare(password, user.password)
