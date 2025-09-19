import { TResponse } from "../../model/response";
import db from "../../pkg/db/conn";
import { categoryTable } from "../../pkg/db/schema/category";
import { TCUCategoryReq } from "./model/req";
import { TCUCategoryRes, TFindAllCategoryResArr, TFindByIdCategoryRes } from "./model/res";
import { eq } from "drizzle-orm";

export const createCategory = async (category: TCUCategoryReq): Promise<TCUCategoryRes> => {
    const [newCategory] = await db.insert(categoryTable).values(category).returning();
    return {
        success: true,
        message: "Category created successfully",
        data: newCategory
    };
}

export const findAllCategory = async (): Promise<TFindAllCategoryResArr> => {
    const categories = await db.select().from(categoryTable);
    return {
        success: true,
        message: "Categories fetched successfully",
        data: categories
    };
}

export const findCategoryById = async (id: string): Promise<TFindByIdCategoryRes> => {
    const [category] = await db.select().from(categoryTable).where(eq(categoryTable.id, id));
    if (!category) {
        return {
            success: false,
            message: "Category not found",
        };
    }
    return {
        success: true,
        message: "Category fetched successfully",
        data: category
    };
}