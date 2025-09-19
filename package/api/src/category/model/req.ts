import { Static, t } from 'elysia';

export const CUCategoryReq = t.Object({
    name: t.String({ minLength: 1 })
})

export type TCUCategoryReq = Static<typeof CUCategoryReq>