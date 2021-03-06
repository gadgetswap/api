import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class User {
  @Field(() => ID)
  id!: string

  @Field()
  @prop({
    required: true
  })
  name!: string

  @Field()
  @prop({
    required: true,
    unique: true
  })
  email!: string

  @prop({
    required: true,
    select: true
  })
  password!: string

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const UserModel = getModelForClass(User)
