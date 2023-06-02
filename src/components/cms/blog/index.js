import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CMS_PAGE_TYPE
} from "../../../constants";
import CmsService from "../../../services/cms";
import CmsFilter from "../../partial/cms-filter";

export default function BlogGrid() {
  const publicUrl = process.env.REACT_APP_PUBLIC_URL + "/";

  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [filters, setFilters] = useState();
  const [blogs, setBlogs] = useState([]);

  const setFilterHandler = (filters) => {
    setFilters(filters);

    loadBlogs(currentPage, filters);
  }

  const loadBlogs = async (page = 1, searchFilters) => {
    let filter = searchFilters ? searchFilters : filters; 

    let payload = {
      pageType: CMS_PAGE_TYPE.BLOGS,
      page,
    };

    if (filter?.category) {
      payload.category = filter.category;
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

    const response = await CmsService.list(payload);
    if (response?.data) {
      setBlogs(response.data);
      setCurrentPage(parseInt(response.page));
      setTotalPages(parseInt(response.totalPage));
    }
  };

  useEffect(() => {
    const fetchAllBlogs = async () => {
      await loadBlogs();
    };

    fetchAllBlogs();
  }, []);

  return (
    <div className="ltn__blog-area mb-120">
      <div className="container">
        <CmsFilter setFilters={setFilterHandler} />

        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__blog-list-wrap">
              {
                blogs && blogs.length === 0 ? (
                  <p>No Data!</p>
                ) : (
                  blogs.map((element, i) => (
                    <div
                      className="ltn__blog-item ltn__blog-item-5 go-top"
                      key={i}
                    >
                      <div className="ltn__blog-img">
                        { 
                          element?.featuredImageFile && (
                            <Link to={"/blog-details/" + element.id}>
                              <img
                                src={`${process.env.REACT_APP_API_URL}/${element.featuredImageFile}`}
                                alt="Image"
                              />
                            </Link>
                          )
                        }
                      </div>
                      <div className="ltn__blog-brief">
                        <h3 className="ltn__blog-title">
                          <Link to={"/blog-details/" + element.id}>
                            {element.title}
                          </Link>
                        </h3>
                        <div className="ltn__blog-meta">
                          <ul>
                            <li className="ltn__blog-date">
                              <i className="far fa-calendar-alt" />
                              {new Date(element.createdAt).toLocaleDateString()}
                            </li>
                          </ul>
                        </div>
                        <p className="blog-grid-desc" dangerouslySetInnerHTML={{ __html: element.description }} />
                        <div className="ltn__blog-meta-btn">
                          <div className="ltn__blog-meta">
                            <ul>
                              <li className="ltn__blog-author">
                                <img
                                  src={publicUrl + "assets/img/blog/author.jpg"}
                                  alt="#"
                                />
                                By: Admin
                              </li>
                            </ul>
                          </div>
                          <div className="ltn__blog-btn">
                            <Link to={"/blog-details/" + element.id}>
                              <i className="fas fa-arrow-right" />
                              Read more
                            </Link>
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
                  blogs && blogs.length > 0 && (
                    <div className="ltn__pagination-area text-center">
                      <div className="ltn__pagination">
                        <ul>
                          <li>
                            <Link
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage !== 1) {
                                  loadBlogs(currentPage - 1);
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
                                      loadBlogs(i + 1);
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
                                  loadBlogs(currentPage + 1);
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
      </div>
    </div>
  );
}
