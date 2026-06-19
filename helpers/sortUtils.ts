import {ArticleData} from "../types/ArticleData";

export function sortDescending(items: ArticleData[]) {
    return [...items].sort((a, b) => b.price - a.price);
}