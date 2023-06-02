import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CmsService from "../../../services/cms";
import CmsFilter from "../../partial/cms-filter";

export default function Index() {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [filters, setFilters] = useState();
  const [communities, setCommunities] = useState([]);

  const setFilterHandler = (filters) => {
    setFilters(filters);

    loadCommunities(currentPage, filters);
  }

  const loadCommunities = async (page = 1, searchFilters) => {
    let filter = searchFilters ? searchFilters : filters; 

    let payload = {
      page
    };

    if (filter?.category) {
      payload.categoryId = filter.category;
    }

    if (filter?.propertyType) {
      payload.propertyType = filter.propertyType;
    }

    if (filter?.propertyCategoryType) {
      payload.propertyCategoryType = filter.propertyCategoryType;
    }

    if (filter?.keyword) {
      payload.keyword = filter.keyword;
    }

    const response = await CmsService.listCommunities(payload);
    if (response?.data) {
        setCommunities(response.data);
        setCurrentPage(parseInt(response.page));
        setTotalPages(parseInt(response.totalPage));
    }
  };

  useEffect(() => {
    const fetchAllCommunities = async () => {
      await loadCommunities();
    };

    fetchAllCommunities();
  }, []);

  return (
    <div className="ltn__blog-area ltn__blog-item-3-normal mb-100 go-top">
      <div className="container">
        <CmsFilter setFilters={setFilterHandler} />

        <div className="row">
          {
            communities && communities.length === 0 ? (
              <p>No Data!</p>
            ) : (
                communities.map((element, i) => (
                    <div className="ltn__comment" key={i}>
                      <div className="ltn__comment-title mb-3">
                        <Link to={ '/community-posts/' + element.id }>{element.title}</Link>
                        <div className="ltn__comment-date">
                          <i className="fa-solid fa-calendar-days"></i>
                          <div className="px-2">
                            {new Date(element.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                ))
            )
          }
        </div>
        <div className="row">
          <div className="col-lg-12">
            {
              communities && communities.length > 0 && (
                <div className="ltn__pagination-area text-center">
                  <div className="ltn__pagination">
                    <ul>
                      <li>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage !== 1) {
                              loadCommunities(currentPage - 1);
                            }
                          }}
                        >
                          <i className="fas fa-angle-double-left" />
                        </Link>
                      </li>
                      
                      {
                        Array.from(Array(totalPages), (e, i) => {
                          return (
                            <li
                              key={i}
                              className={currentPage == i + 1 ? "active" : null}
                            >
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  loadCommunities(i + 1);
                                }}
                              >
                                {i + 1}
                              </Link>
                            </li>
                          );
                        })
                      }

                      <li>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage !== totalPages) {
                              loadCommunities(currentPage + 1);
                            }
                          }}
                        >
                          <i className="fas fa-angle-double-right" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
