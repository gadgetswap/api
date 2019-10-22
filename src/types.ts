import { Field, ObjectType } from 'type-graphql'

import { User } from './models'

export interface Context {
  user?: User
}

@ObjectType()
export class AuthResult {
  @Field()
  token!: string

  @Field()
  user!: User
}
