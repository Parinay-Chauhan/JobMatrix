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
        <p className="text-xs text-slate-400 font-medium">
          Showing <span className="font-bold text-emerald-400">{startItem}</span> to{" "}
          <span className="font-bold text-emerald-400">{endItem}</span> of{" "}
          <span className="font-bold text-white">{totalItems}</span> results
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:bg-slate-950 disabled:text-slate-600 disabled:border-slate-900"
        >
          &larr; Previous
        </Button>

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200">
          Page <span className="text-emerald-400">{currentPage}</span> of {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:bg-slate-950 disabled:text-slate-600 disabled:border-slate-900"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

