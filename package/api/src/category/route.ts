import Elysia from "elysia";
import { createCategory, findAllCategory, findCategoryById } from "./service";
import { CUCategoryReq, FindByIdCategoryReq } from "./model/req";

const category = new Elysia({
    prefix: '/categories'
}).post('', ({ body }) => createCategory(body), {
    body: CUCategoryReq
}).get('', () => findAllCategory()).get('/:id', ({ params }) => findCategoryById(params.id), {
    params: FindByIdCategoryReq
})

export default category