import Elysia from "elysia";
import { ask, createNote } from "./service";
import { askAISchema, CUNoteSchema } from "./model/req";

const note = new Elysia({
    prefix: "/note"
}).post("/", ({body})=>createNote(body),{
    body: CUNoteSchema
}).post("/ask", ({body})=>ask(body),{
    body: askAISchema
})

export default note;