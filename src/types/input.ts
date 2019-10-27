import { Field, InputType, Int } from 'type-graphql'

import { Gadget, Location } from '../models'

// gadgets

@InputType()
export class CreateGadgetInput implements Partial<Gadget> {
  @Field()
  title!: string

  @Field()
  description!: string

  @Field(() => Int)
  quantity!: number

  @Field(() => [String])
  images!: string[]
}

// locations

@InputType()
export class CreateLocationInput implements Partial<Location> {
  @Field()
  city!: string

  @Field()
  country!: string
}
