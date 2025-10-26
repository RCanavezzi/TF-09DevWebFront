import { ListApi, ProductModel } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";


export default async function productListApi(
    limit = 10, 
    page = 1,   
    search = '', 
    orderBy = "id,desc"
) {


    const query = new URLSearchParams({
        "orderBy": orderBy,
        "limit": limit.toString(),
        "page": page.toString(), 
    });

 
    if (search) {
       
        query.append("query", search);
    }

    try {
        
        const { data } = await baseAxios.get<ListApi<ProductModel>>(`api/products?${query}`);


        return data;
    } catch (error) {
        return catchError(error);
    }
}