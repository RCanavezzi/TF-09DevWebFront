import ProductList from "@app/js/React/components/ProductList/ProductList";
import ProductCreateForm from "@app/js/React/components/ProductCreateForm/ProductCreateForm";
import Pagination from "@app/js/React/Components/Pagination";
import { useEffect, useState, useRef, useCallback, ChangeEvent } from "react";
import { ProductModel } from "@app/js/app.types";
import productListApi from "@app/js/services/api/productListApi";


interface ProductListResponse {
    rows: ProductModel[];
    currentPage: number;
    lastPage: number; // 👈 ESSENCIAL: Total de páginas
    total: number;
}

const typedProductListApi = productListApi as (perPage: number, page: number, search: string) => Promise<ProductListResponse | { error: true }>;


export default function Products() {
    // 1. Estados e Referências para Busca e Paginação
    const [productList, setProductList] = useState<ProductModel[] | "error">();
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1); 
    const [searchTerm, setSearchTerm] = useState('');
    const debouceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const PER_PAGE = 10;

    // 2. Função de Busca (listApi) Refatorada
    const listApi = useCallback(async (page: number, search: string) => {

        const resp = await typedProductListApi(PER_PAGE, page, search);
        
        if ("error" in resp) {
            setProductList("error");
            return;
        }

        setProductList(resp.rows);
        setCurrentPage(resp.currentPage);
        setLastPage(resp.lastPage); // 👈 SALVANDO O TOTAL DE PÁGINAS

    }, [PER_PAGE]);

    // 3. Efeito de Busca (Debounce) - Sem alterações, já funciona!
    useEffect(() => {
        if (debouceTimerRef.current) {
            clearTimeout(debouceTimerRef.current);
        }

        debouceTimerRef.current = setTimeout(() => {
            // Quando a busca muda, sempre RECOMEÇAMOS na página 1.
            listApi(1, searchTerm); 
        }, 500);

        return () => {
            if (debouceTimerRef.current) {
                clearTimeout(debouceTimerRef.current);
            }
        };
    }, [searchTerm, listApi]);

    // 4. Manipulador de Mudança do Input - Sem alterações!
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }
    
    // 5. Handlers de Ação (Create e Delete) - Sem alterações!
    const createProductHandler = () => {
        listApi(currentPage, searchTerm);
    }

    const deleteProductHandler = () => {
        listApi(currentPage, searchTerm);
    }

    // 6. Efeito Inicial (apenas na montagem) - Sem alterações!
    useEffect(() => {
        listApi(1, '');
    }, [listApi]);


    // 7. FUNÇÃO DE MUDANÇA DE PÁGINA (Callback para o componente Pagination)
    const handlePageChange = (page: number) => {

        listApi(page, searchTerm);
    }

    // 8. Renderização com o Componente de Paginação
    return (
        <div className="row g-4">
            {/* Campo de Busca */}
            <div className="col-12">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            
            <ProductCreateForm onCreate={createProductHandler} />
            <ProductList products={productList} onDelete={deleteProductHandler} />
            
            {/* Componente de Paginação */}
            <div className="col-12">
                {productList && productList !== "error" && lastPage > 1 && (
                    <Pagination 
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
            
        </div>
    );
}