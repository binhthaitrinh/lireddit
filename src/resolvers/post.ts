import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    // destructure the em from the context passed by ApolloServer
    @Ctx() { em }: MyContext
  ): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, id);
  }
}