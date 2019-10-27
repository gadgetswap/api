import { Field, ObjectType, registerEnumType } from 'type-graphql'

import { User } from '../models'

@ObjectType()
export class AuthResult {
  @Field()
  token!: string

  @Field(() => User)
  user!: User
}

export enum GadgetStatus {
  AVAILABLE = 'AVAILABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE'
}

registerEnumType(GadgetStatus, {
  name: 'GadgetStatus'
})

export enum GadgetRequestStatus {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  PENDING = 'PENDING'
}

registerEnumType(GadgetRequestStatus, {
  name: 'GadgetRequestStatus'
})
