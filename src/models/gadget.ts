import {
  arrayProp,
  getModelForClass,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'

import { GadgetRequestStatus, GadgetStatus } from '../types/graphql'
import { Comment } from './comment'
import { Location } from './location'
import { User } from './user'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class GadgetRequest {
  @Field(() => ID)
  id!: string

  @Field()
  @prop({
    required: true
  })
  description!: string

  @Field(() => GadgetRequestStatus)
  @prop({
    default: GadgetRequestStatus.PENDING,
    enum: Object.values(GadgetRequestStatus)
  })
  status!: string

  @Field(() => User)
  @prop({
    ref: 'User',
    required: true
  })
  user!: Ref<User>

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Gadget {
  @Field(() => ID)
  id!: string

  @Field()
  @prop({
    required: true
  })
  title!: string

  @Field()
  @prop({
    required: true
  })
  description!: string

  @Field(() => [String])
  @arrayProp({
    items: String
  })
  images!: string[]

  @Field(() => Location)
  @prop({
    ref: 'Location',
    required: true
  })
  location!: Ref<Location>

  @Field()
  @prop({
    default: 1
  })
  quantity!: number

  @Field(() => GadgetStatus)
  @prop({
    default: GadgetStatus.AVAILABLE,
    enum: Object.values(GadgetStatus),
    index: true
  })
  status!: string

  @Field(() => [Comment])
  @arrayProp({
    foreignField: 'gadget',
    localField: '_id',
    options: {
      sort: {
        createdAt: -1
      }
    },
    ref: 'Comment'
  })
  comments!: Ref<Comment>[]

  @arrayProp({
    items: GadgetRequest
  })
  requests!: GadgetRequest[]

  @Field(() => User)
  @prop({
    ref: 'User',
    required: true
  })
  user!: Ref<User>

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const GadgetModel = getModelForClass(Gadget)
