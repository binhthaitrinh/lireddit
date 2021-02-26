import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { createConnection } from "typeorm";
require("dotenv").config();

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "lireddit-3",
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    // create table automatically without migration
    synchronize: true,
    entities: [Post, User],
  });

  // const post = orm.em.create(Post, { title: "my first post" });
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = new Redis();
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        // to prevent users from keeping sessions open too long, also cut down extra calls
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3650,
        httpOnly: true,
        secure: __prod__, // cookie only works in https,
        sameSite: "lax", // protect against csrf
      },
      secret: "asdhqkwheqwehqwehqwuehlqkwhequwleh",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // context is special obj that is accessible by all Resolver, we can pass the orm obj here, and we only care the em so pass em only
    context: ({ req, res }) => ({ req, res, redis: redisClient }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log(`listening on localhost:4000`);
  });
};

main().catch((err) => {
  console.log(err);
});
