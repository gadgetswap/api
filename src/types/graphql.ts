import { Field, ObjectType, registerEnumType } from 'type-graphql'

import { User } from '../models'

@ObjectType()
export class AuthResult {
  @Field()
  token!: string

  @Field(() => User)
  user!: User
}

export enum GadgetRequestStatus {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  PENDING = 'PENDING'
}

registerEnumType(GadgetRequestStatus, {
  name: 'GadgetRequestStatus'
})
