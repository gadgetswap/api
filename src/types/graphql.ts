import { Field, ObjectType } from 'type-graphql'

import { User } from '../models'

@ObjectType()
export class AuthResult {
  @Field()
  token!: string

  @Field()
  user!: User
}
