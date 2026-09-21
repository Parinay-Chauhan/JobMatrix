import React from "react";
import Button from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}
    >
      {totalItems !== undefined && (
        <p className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-800">{startItem}</span> to{" "}
          <span className="font-bold text-gray-800">{endItem}</span> of{" "}
          <span className="font-bold text-gray-800">{totalItems}</span> results
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &larr; Previous
        </Button>

        <div className="flex items-center gap-1 px-2 text-xs font-semibold text-gray-700">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
