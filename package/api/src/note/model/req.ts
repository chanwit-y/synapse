import { Static, t } from 'elysia';

export const CUNote = t.Object({
    name: t.String(),
    categoryId: t.String(),
    content: t.String(),
})

export type CUNote = Static<typeof CUNote>