import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'

import { Gadget } from './gadget'
import { User } from './user'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Comment {
  @Field(() => ID)
  id!: string

  @Field()
  @prop({
    required: true
  })
  body!: string

  @prop({
    ref: 'Gadget',
    required: true
  })
  gadget!: Ref<Gadget>

  @Field(() => User)
  @prop({
    ref: 'User',
    required: true
  })
  user!: Ref<User>

  @Field()
  @prop({
    default: new Date()
  })
  createdAt!: Date
}

export const CommentModel = getModelForClass(Comment)
