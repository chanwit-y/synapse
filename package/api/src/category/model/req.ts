import { Static, t } from 'elysia';

export const CUCategoryReq = t.Object({
    name: t.String({ minLength: 1 })
})

export const FindByIdCategoryReq = t.Object({
    id: t.String({ format: 'uuid' })
})

export type TCUCategoryReq = Static<typeof CUCategoryReq>
export type TFindByIdCategoryReq = Static<typeof FindByIdCategoryReq>