import { GadgetResolver } from './gadget'
import { LocationResolver } from './location'
import { AuthResolver, UserResolver } from './user'

export const resolvers = [
  AuthResolver,
  GadgetResolver,
  LocationResolver,
  UserResolver
]
