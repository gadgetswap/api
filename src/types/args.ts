import { ArgsType, Field } from 'type-graphql'

import { CreateGadgetInput } from './input'

@ArgsType()
export class CreateCommentArgs {
  @Field()
  body!: string

  @Field()
  gadgetId!: string
}

@ArgsType()
export class GadgetArgs {
  @Field()
  gadgetId!: string
}

@ArgsType()
export class CreateGadgetArgs {
  @Field()
  data!: CreateGadgetInput
}

@ArgsType()
export class LoginArgs {
  @Field()
  email!: string

  @Field()
  password!: string
}

@ArgsType()
export class RegisterArgs {
  @Field()
  email!: string

  @Field()
  name!: string

  @Field()
  password!: string
}
