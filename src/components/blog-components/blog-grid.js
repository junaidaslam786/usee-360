import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import {
  PRODUCT_CATEGORIES,
  PROPERTY_TYPES,
  RESIDENTIAL_PROPERTY,
  COMMERCIAL_PROPERTY,
  PROPERTY_CATEGORY_TYPES,
} from "../../constants";

export default function BlogGrid() {
  let publicUrl = process.env.PUBLIC_URL + "/";

  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertySubType, setPropertySubType] = useState();
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [keyword, setKeyword] = useState();
  const [propertySubTypeOptions, setPropertySubTypeOptions] = useState(null);

  const [blogs, setBlogs] = useState([]);

  const setPropertyCategoryTypeHandler = (e) => {
    setPropertyCategoryType(e);
  };

  const setPropertyTypeHandler = (e) => {
    setPropertyType(e);
    setPropertySubTypeOptions(
      e.value == "residential" ? RESIDENTIAL_PROPERTY : COMMERCIAL_PROPERTY
    );
  };

  async function loadBlogs(page = 1) {
    let payload = {
      pageType: "blogs",
      page: page,
      size: 10,
    };

    if(propertyType) {
      payload.propertyType = propertyType.value;
    }

    if(propertySubType) {
      payload.propertySubType = propertySubType.value;
    }

    if(propertyCategoryType) {
      payload.propertyCategoryType = propertyCategoryType.value;
    }

    if(keyword) {
      payload.keyword = keyword;
    }

    await axios
      .post(`${process.env.REACT_APP_API_URL}/cms/all-pages`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setBlogs(response.data.data);
        setCurrentPage(parseInt(response.data.page));
        setTotalPages(parseInt(response.data.totalPage));
      });
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="ltn__blog-area mb-120">
      <div className="container">
        <div className="ltn__car-dealer-form-area mt-120 mb-120">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="ltn__car-dealer-form-tab">
                  <div className="tab-content bg-white box-shadow-1 position-relative pb-10">
                    <div
                      className="tab-pane fade active show"
                      id="ltn__form_tab_1_1"
                    >
                      <div className="car-dealer-form-inner">
                        <form
                          className="ltn__car-dealer-form-box row"
                          onSubmit={(e) => {
                            e.preventDefault();
                            loadBlogs();
                          }}
                        >
                          <div className="input-item col-lg-3 col-md-6">
                            <label>Category</label>
                            <div className="input-item">
                              <Select
                                classNamePrefix="custom-select"
                                options={PRODUCT_CATEGORIES}
                              />
                            </div>
                          </div>
                          <div className="input-item col-lg-3 col-md-6">
                            <label>Property Type</label>
                            <div className="input-item">
                              <Select
                                classNamePrefix="custom-select"
                                options={PROPERTY_TYPES}
                                onChange={(e) => setPropertyTypeHandler(e)}
                                value={propertyType}
                              />
                            </div>
                          </div>
                          <div className="input-item col-lg-3 col-md-6">
                            <label>Property Category Type</label>
                            <div className="input-item">
                              <Select
                                classNamePrefix="custom-select"
                                options={PROPERTY_CATEGORY_TYPES}
                                onChange={(e) =>
                                  setPropertyCategoryTypeHandler(e)
                                }
                                value={propertyCategoryType}
                              />
                            </div>
                          </div>
                          <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
                            <label>Keyword</label>
                            <input
                              type="text"
                              placeholder="Search..."
                              onChange={(e) => setKeyword(e.target.value)}
                              className="m-0"
                            />
                          </div>
                          <div className="ltn__car-dealer-form-item ltn__custom-icon ltn__icon-calendar col-lg-3 col-md-6">
                            <div className="btn-wrapper mt-0 go-top pt-1">
                              <button
                                className="btn theme-btn-1 btn-effect-1 text-uppercase search-btn"
                                type="submit"
                              >
                                Find Now
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__blog-list-wrap">
              {blogs && blogs.length === 0 ? (
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
              )}
            </div>
            <div className="row">
              <div className="col-lg-12">
                {blogs && blogs.length > 0 && (
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
                        {Array.from(Array(totalPages), (e, i) => {
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
                        })}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
