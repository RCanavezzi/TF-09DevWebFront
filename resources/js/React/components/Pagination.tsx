import React from 'react';

// 1. Definição da Interface das Props (Propriedades)
interface PaginationProps {
    currentPage: number; // A página atual sendo exibida
    lastPage: number;    // O número total de páginas disponíveis
    onPageChange: (page: number) => void; // Função de callback para mudar a página
}

// 2. Componente de Paginação
export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {

    // Lógica para o botão "Anterior"
    const handlePrevious = () => {
        // Só permite voltar se a página atual for maior que 1
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    // Lógica para o botão "Próxima"
    const handleNext = () => {
        // Só permite avançar se a página atual for menor que a última página
        if (currentPage < lastPage) {
            onPageChange(currentPage + 1);
        }
    };

    // 3. Renderização (Utilizando classes do Bootstrap)
    return (
        <nav aria-label="Navegação de Produtos">
            <ul className="pagination justify-content-center">
                
                {/* Botão Anterior */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a 
                        className="page-link" 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault(); // Evita que a página recarregue
                            handlePrevious();
                        }}
                        aria-disabled={currentPage === 1}
                    >
                        Anterior
                    </a>
                </li>

                {/* Podemos adicionar botões numéricos aqui, mas para simplificar, 
                    vamos focar em "Anterior" e "Próxima" como requisito mínimo.
                    Por exemplo, a página atual:
                */}
                <li className="page-item active">
                    <span className="page-link">
                        Página {currentPage} de {lastPage}
                    </span>
                </li>

                {/* Botão Próxima */}
                <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                    <a 
                        className="page-link" 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault(); // Evita que a página recarregue
                            handleNext();
                        }}
                        aria-disabled={currentPage === lastPage}
                    >
                        Próxima
                    </a>
                </li>
            </ul>
        </nav>
    );
}