import { Post } from "../entities/Post";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): // destructure the em from the context passed by ApolloServer
  Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(
    // type-graphql might be able to figure out the return type based on typescript type
    // so () => String can be removed
    @Arg("title", () => String) title: string
  ): Promise<Post> {
    return Post.create({ title }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    // type-graphql might be able to figure out the return type based on typescript type
    // so () => String can be removed
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    // Post.findOne({where: {id}})
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ _id: id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    // type-graphql might be able to figure out the return type based on typescript type
    // so () => String can be removed
    @Arg("id") id: number
  ): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
