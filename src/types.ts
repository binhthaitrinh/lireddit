import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & {
    session: { userId?: number };
  };
  res: Response;
};
