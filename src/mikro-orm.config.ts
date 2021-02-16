import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
require("dotenv").config();

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[jt]s$/,
  },
  entities: [Post],
  dbName: process.env.DB_NAME,
  type: "postgresql",
  debug: !__prod__,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
} as Parameters<typeof MikroORM.init>[0];
