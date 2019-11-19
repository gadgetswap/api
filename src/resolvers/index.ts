import { CommentResolver } from './comment'
import { GadgetResolver } from './gadget'
import { LocationResolver } from './location'
import { RequestResolver } from './request'
import { UserResolver } from './user'

export const resolvers = [
  CommentResolver,
  GadgetResolver,
  LocationResolver,
  RequestResolver,
  UserResolver
]
