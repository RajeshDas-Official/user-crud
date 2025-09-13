export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const safeCurrent = Number(currentPage) || 1;
  const safeTotal = Number(totalPages) || 1;
  
  if (safeTotal <= 1) {
    return null;
  }
  
  const pages = [];
  const maxVisible = 5; 
  
  let startPage = Math.max(1, safeCurrent - Math.floor(maxVisible / 2));
  let endPage = Math.min(safeTotal, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= safeTotal && page !== safeCurrent) {
      console.log('Changing to page:', page);
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-sm text-gray-600">
        Page {safeCurrent} of {safeTotal}
      </div>
 
      <div className="flex justify-center items-center space-x-1">
        <button
          onClick={() => handlePageChange(safeCurrent - 1)}
          disabled={safeCurrent === 1}
          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          title="Previous page"
        >
          Previous
        </button>
        
        {/* First page + ellipsis */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 border rounded-md transition-colors ${
              page === safeCurrent
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
   
        {endPage < safeTotal && (
          <>
            {endPage < safeTotal - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(safeTotal)}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {safeTotal}
            </button>
          </>
        )}
    
        <button
          onClick={() => handlePageChange(safeCurrent + 1)}
          disabled={safeCurrent === safeTotal}
          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          title="Next page"
        >
          Next
        </button>
      </div>
      
      {safeTotal > 10 && (
        <div className="flex space-x-2 text-sm">
          <button
            onClick={() => handlePageChange(1)}
            disabled={safeCurrent === 1}
            className="px-2 py-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            First
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => handlePageChange(safeTotal)}
            disabled={safeCurrent === safeTotal}
            className="px-2 py-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}