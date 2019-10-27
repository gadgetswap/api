import { Field, InputType, Int } from 'type-graphql'

import { Gadget, Location } from '../models'

@InputType()
export class CreateLocationInput implements Partial<Location> {
  @Field()
  city!: string

  @Field()
  country!: string
}

@InputType()
export class CreateGadgetInput extends CreateLocationInput
  implements Partial<Gadget> {
  @Field()
  title!: string

  @Field()
  description!: string

  @Field(() => Int)
  quantity!: number

  @Field(() => [String])
  images!: string[]
}
