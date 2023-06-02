import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CMS_PAGE_TYPE
} from "../../../constants";
import CmsService from "../../../services/cms";
import CmsFilter from "../../partial/cms-filter";

export default function NewsGrid() {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [filters, setFilters] = useState();
  const [news, setNews] = useState([]);

  const setFilterHandler = (filters) => {
    setFilters(filters);

    loadNews(currentPage, filters);
  }

  const loadNews = async (page = 1, searchFilters) => {
    let filter = searchFilters ? searchFilters : filters; 

    let payload = {
      pageType: CMS_PAGE_TYPE.NEWS,
      page
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
      setNews(response.data);
      setCurrentPage(parseInt(response.page));
      setTotalPages(parseInt(response.totalPage));
    }
  };

  useEffect(() => {
    const fetchAllNews = async () => {
      await loadNews();
    };

    fetchAllNews();
  }, []);

  return (
    <div className="ltn__blog-area ltn__blog-item-3-normal mb-100 go-top">
      <div className="container">
        <CmsFilter setFilters={setFilterHandler} />

        <div className="row">
          {
            news && news.length === 0 ? (
              <p>No Data!</p>
            ) : (
              news.map((element, i) => (
                <div className="col-lg-4 col-sm-6 col-12" key={i}>
                  <div className="ltn__blog-item ltn__blog-item-3">
                    <div className="ltn__blog-img">
                      { 
                        element?.featuredImageFile && (
                          <Link to={"/news-details/" + element.id}>
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${element.featuredImageFile}`}
                              alt="#"
                            />
                          </Link>
                        )
                      }
                    </div>
                    <div className="ltn__blog-brief">
                      <div className="ltn__blog-meta">
                        <ul>
                          <li className="ltn__blog-author go-top">
                            <Link to="/team-details">
                              <i className="far fa-user" />
                              by: Admin
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <h3 className="ltn__blog-title-news">
                        <Link to={"/news-details/" + element.id}>
                          {element.title}
                        </Link>
                      </h3>
                      <div className="ltn__blog-meta-btn">
                        <div className="ltn__blog-meta">
                          <ul>
                            <li className="ltn__blog-date">
                              <i className="far fa-calendar-alt" />
                              {new Date(element.createdAt).toLocaleDateString()}
                            </li>
                          </ul>
                        </div>
                        <div className="ltn__blog-btn">
                          <Link to={"/news-details/" + element.id}>
                            Read more
                          </Link>
                        </div>
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
              news && news.length > 0 && (
                <div className="ltn__pagination-area text-center">
                  <div className="ltn__pagination">
                    <ul>
                      <li>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage !== 1) {
                              loadNews(currentPage - 1);
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
                                  loadNews(i + 1);
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
                              loadNews(currentPage + 1);
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
