import Elysia from "elysia";
import { createCategory, findAllCategory } from "./service";
import { CUCategoryReq } from "./model/req";

const category = new Elysia({
    prefix: '/categories'
}).get('', () => findAllCategory()).post('', ({ body }) => createCategory(body), {
    body: CUCategoryReq
})

export default category