import {
  arrayProp,
  getModelForClass,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'

import { Comment } from './comment'
import { User } from './user'

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

  @Field()
  @prop({
    index: true,
    required: true
  })
  city!: string

  @Field()
  @prop({
    index: true,
    required: true
  })
  country!: string

  @Field(() => [String])
  @arrayProp({
    items: String
  })
  images!: string[]

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
