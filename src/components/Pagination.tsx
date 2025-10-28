'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; 

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push('...');
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex justify-center items-center space-x-2 my-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border dark:border-gray-700 dark:text-dark-text dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={20} />
            </button>

            {pageNumbers.map((page, index) => (
                <React.Fragment key={index}>
                    {typeof page === 'number' ? (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`px-4 py-2 rounded-lg border dark:border-gray-700 ${
                                currentPage === page
                                    ? 'bg-blue-600 text-white dark:bg-blue-700'
                                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span className="px-4 py-2 text-gray-500 dark:text-gray-400">...</span>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border dark:border-gray-700 dark:text-dark-text dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight size={20} />
            </button>
        </nav>
    );
};

export default Pagination;
