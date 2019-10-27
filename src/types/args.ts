import { ArgsType, Field } from 'type-graphql'

import { GadgetRequestStatus } from './graphql'
import { CreateGadgetInput } from './input'

// auth

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

// comments

@ArgsType()
export class CreateCommentArgs {
  @Field()
  body!: string

  @Field()
  gadgetId!: string
}

// gadgets

@ArgsType()
export class GadgetsArgs {
  @Field()
  locationId!: string
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
export class RequestGadgetArgs {
  @Field()
  description!: string

  @Field()
  gadgetId!: string
}

@ArgsType()
export class UpdateRequestArgs {
  @Field()
  gadgetId!: string

  @Field()
  requestId!: string

  @Field(() => GadgetRequestStatus)
  status!: GadgetRequestStatus
}
