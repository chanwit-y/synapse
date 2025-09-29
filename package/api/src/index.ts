import { Elysia } from "elysia";
import category from "./category/route";
import note from "./note/route";
import conversation from "./conversation/route";

const app = new Elysia().get("/", () => "Hello Elysia").use(category).use(note).use(conversation).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
