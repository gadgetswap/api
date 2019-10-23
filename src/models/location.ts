import {
  getModelForClass,
  index,
  modelOptions,
  prop
} from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
@index(
  {
    city: 1,
    country: 1
  },
  {
    unique: true
  }
)
export class Location {
  @Field(() => ID)
  id!: string

  @Field()
  @prop({
    required: true
  })
  city!: string

  @Field()
  @prop({
    required: true
  })
  country!: string

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const LocationModel = getModelForClass(Location)
