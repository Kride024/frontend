import React from "react";
import tailwindStyles from "../../../../../../../packages/styles/tailwindStyles";
import useUserListingsStore from "../../../store/userListingsStore";

interface PaginationControlsProps {
  userId: number | string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ userId }) => {
  const { currentPage, totalPages, setCurrentPage, fetchUserListings } =
    useUserListingsStore();

  const handlePageChange = async (newPage: number): Promise<void> => {
    if (newPage !== currentPage && newPage > 0 && newPage <= totalPages) {
      await setCurrentPage(newPage);
      await fetchUserListings(userId, true); // force refresh
      window.scrollTo(0, 0);
    }
  };

  if (totalPages <= 1) return null;

  // Page number list
  const pageNumbers: number[] = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => {
      const page = Math.max(1, currentPage - 2) + index;
      return page <= totalPages ? page : null;
    }
  ).filter((page): page is number => page !== null);

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${
          currentPage === 1
            ? `${tailwindStyles.thirdButton} cursor-not-allowed`
            : tailwindStyles.secondaryButton
        }`}
      >
        Previous
      </button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-6 h-6 border text-xs font-semibold rounded-md ${
            page === currentPage
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-100 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${
          currentPage === totalPages
            ? `${tailwindStyles.thirdButton} cursor-not-allowed`
            : tailwindStyles.secondaryButton
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
