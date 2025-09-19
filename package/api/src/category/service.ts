import { TResponse } from "../../model/response";
import db from "../../pkg/db/conn";
import { categoryTable } from "../../pkg/db/schema/category";
import { TCUCategoryReq } from "./model/req";
import { TCUCategoryRes, TCUCategoryResArr } from "./model/res";

export const createCategory = async (category: TCUCategoryReq): Promise<TResponse<TCUCategoryRes>> => {
    const [newCategory] = await db.insert(categoryTable).values(category).returning();
    return {
        success: true,
        message: "Category created successfully",
        data: newCategory
    };
}

export const findAllCategory = async(): Promise<TResponse<TCUCategoryResArr>> => {
    const categories = await db.select().from(categoryTable);
    return {
        success: true,
        message: "Categories fetched successfully",
        data: categories
    };
}