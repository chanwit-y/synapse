import { Static, t } from 'elysia';

export const CUCategoryRes = t.Object({
    id: t.String({ format: 'uuid' }),
    name: t.String({ minLength: 1 })
})

export const CUCategoryResArr = t.Array(t.Object({
    id: t.String({ format: 'uuid' }),
    name: t.String({ minLength: 1 })
}))

export type TCUCategoryRes = typeof CUCategoryRes
export type TCUCategoryResArr = typeof CUCategoryResArr