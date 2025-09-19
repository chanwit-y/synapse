import { Static, t } from 'elysia';
import { TResponse } from '../../../model/response';

export const CUCategoryRes = t.Object({
    id: t.String({ format: 'uuid' }),
    name: t.String({ minLength: 1 })
})

export const FindAllCategoryResArr = t.Array(t.Object({
    id: t.String({ format: 'uuid' }),
    name: t.String({ minLength: 1 })
}))

export const FindByIdCategoryRes = t.Optional(t.Object({
    id: t.String({ format: 'uuid' }),
    name: t.String({ minLength: 1 })
}))

export type TCUCategoryRes = TResponse<typeof CUCategoryRes>
export type TFindAllCategoryResArr = TResponse<typeof FindAllCategoryResArr>
export type TFindByIdCategoryRes = TResponse<typeof FindByIdCategoryRes>