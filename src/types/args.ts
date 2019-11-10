import { ArgsType, Field, ID } from 'type-graphql'

import { GadgetRequestStatus } from './graphql'
import { CreateGadgetInput, CreateLocationInput } from './input'

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

  @Field(() => ID)
  gadgetId!: string
}

// gadgets

@ArgsType()
export class GadgetsArgs {
  @Field(() => ID)
  locationId!: string
}

@ArgsType()
export class GadgetArgs {
  @Field(() => ID)
  gadgetId!: string
}

@ArgsType()
export class CreateGadgetArgs {
  @Field()
  data!: CreateGadgetInput

  @Field(() => ID)
  locationId!: string
}

@ArgsType()
export class RequestGadgetArgs {
  @Field()
  description!: string

  @Field(() => ID)
  gadgetId!: string
}

@ArgsType()
export class UpdateRequestArgs {
  @Field(() => ID)
  gadgetId!: string

  @Field(() => ID)
  requestId!: string

  @Field(() => GadgetRequestStatus)
  status!: GadgetRequestStatus
}

// locations

@ArgsType()
export class CitiesArgs {
  @Field()
  country!: string
}

@ArgsType()
export class CreateLocationArgs {
  @Field()
  data!: CreateLocationInput
}
