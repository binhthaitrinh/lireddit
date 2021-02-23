import { InputType, Field } from "type-graphql";

// another way to receive multiple Args

@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}
