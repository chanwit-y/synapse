import { Static, t, TSchema } from "elysia"

export const Response = <T extends TSchema>(dataType: T) => t.Object({
    success: t.Boolean(),
    message: t.String(),
    data: dataType
})

export type TResponse<T extends TSchema> = Static<ReturnType<typeof Response<T>>>