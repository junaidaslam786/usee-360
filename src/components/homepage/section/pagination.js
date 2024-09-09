import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  if (totalPages <= 1) return null; // If there's only one page, no need to display pagination

  return (
    <div className="ltn__pagination-area text-center">
      <div className="ltn__pagination">
        <ul>
          {/* Previous button */}
          <li>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
            >
              <i className="fas fa-angle-double-left" />
            </Link>
          </li>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={currentPage === i + 1 ? "active" : null}
            >
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i + 1);
                }}
              >
                {i + 1}
              </Link>
            </li>
          ))}

          {/* Next button */}
          <li>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
            >
              <i className="fas fa-angle-double-right" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
