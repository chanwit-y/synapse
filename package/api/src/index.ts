import { Elysia } from "elysia";
import category from "./category/route";

const app = new Elysia().get("/", () => "Hello Elysia").use(category).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
