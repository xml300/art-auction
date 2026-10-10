"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
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
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center gap-1.5 my-6" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="p-2 rounded-xl border border-border-subtle bg-surface text-text hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === "number" ? (
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "min-w-9 h-9 px-3 rounded-xl text-xs font-semibold transition-all shadow-xs",
                currentPage === page
                  ? "bg-primary text-white"
                  : "border border-border-subtle bg-surface text-text hover:bg-surface-elevated"
              )}
            >
              {page}
            </button>
          ) : (
            <span className="px-2 text-xs text-text-muted select-none">...</span>
          )}
        </React.Fragment>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="p-2 rounded-xl border border-border-subtle bg-surface text-text hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
