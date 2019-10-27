import { Field, InputType, Int } from 'type-graphql'

import { Gadget } from '../models'

@InputType()
export class CreateGadgetInput implements Partial<Gadget> {
  @Field()
  title!: string

  @Field()
  description!: string

  @Field()
  city!: string

  @Field()
  country!: string

  @Field(() => Int)
  quantity!: number

  @Field(() => [String])
  images!: string[]
}
