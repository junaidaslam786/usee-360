import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import {
  PRODUCT_CATEGORIES,
  PROPERTY_TYPES,
  PROPERTY_CATEGORY_TYPES,
} from "../../constants";
import ResponseHandler from "../global-components/respones-handler";

export default function Community() {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [categoryFilter, setCategoryFilter] = useState();
  const [propertyTypeFilter, setPropertyTypeFilter] = useState();
  const [propertyCategoryTypeFilter, setPropertyCategoryTypeFilter] = useState();
  const [keyword, setKeyword] = useState();
  const [category, setCategory] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertyCategoryType, setPropertyCategoryType] = useState();

  const [questions, setQuestions] = useState([]);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [title, setTitle] = useState();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState(null);


  async function loadQuestions(page = 1, newPost = false) {
    let payload = {
      page: page,
      size: 10,
    };

    if(!newPost && categoryFilter) {
      payload.categoryId = categoryFilter.value;
    }

    if(!newPost && propertyTypeFilter) {
      payload.propertyType = propertyTypeFilter.value;
    }

    if(!newPost && propertyCategoryTypeFilter) {
      payload.propertyCategoryType = propertyCategoryTypeFilter.value;
    }

    if(!newPost && keyword) {
      payload.keyword = keyword;
    }

    await axios
      .post(`${process.env.REACT_APP_API_URL}/cms/all-posts`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setQuestions(response.data.data);
        setCurrentPage(parseInt(response.data.page));
        setTotalPages(parseInt(response.data.totalPage));
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("name", name.trim());
    formdata.append("email", email.trim());
    formdata.append("title", title.trim());
    formdata.append("category", category.value);

    if (propertyType?.value) {
      formdata.append("metaTags[1]", propertyType.value);
    }

    if (propertyCategoryType) {
      formdata.append("metaTags[2]", propertyCategoryType.value);
    }

    await axios
      .post(`${process.env.REACT_APP_API_URL}/cms/create-post`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response?.status !== 200) {
          setErrorHandler(
            "Unable to post question, please try again later"
          );
        }

        setSuccessHandler("Question posted successfully");
        setName("");
        setEmail("");
        setTitle("");
        setCategory("");
        setPropertyType("");
        setPropertyCategoryType("");
        loadQuestions(1, true);
      })
      .catch((error) => {
        console.log("create-question-error", error);
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else if (error?.response?.data?.message) {
          setErrorHandler(error.response.data.message);
        } else {
          setErrorHandler(
            "Unable to post question, please try again later"
          );
        }
      });
  }

  const setErrorHandler = (msg, param = "form", fullError = false) => {
    setErrors(fullError ? msg : [{ msg, param }]);
    setTimeout(() => {
      setErrors([]);
    }, 3000);
    setSuccess("");
  };

  const setSuccessHandler = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
    }, 3000);

    setErrors([]);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div className="ltn__faq-area mb-100">
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
                            loadQuestions();
                          }}
                        >
                          <div className="input-item col-lg-3 col-md-6">
                            <label>Category</label>
                            <div className="input-item">
                              <Select
                                classNamePrefix="custom-select"
                                options={PRODUCT_CATEGORIES}
                                onChange={(e) => setCategoryFilter(e)}
                                value={categoryFilter}
                              />
                            </div>
                          </div>
                          <div className="input-item col-lg-3 col-md-6">
                            <label>Property Type</label>
                            <div className="input-item">
                              <Select
                                classNamePrefix="custom-select"
                                options={PROPERTY_TYPES}
                                onChange={(e) => setPropertyTypeFilter(e)}
                                value={propertyTypeFilter}
                              />
                            </div>
                          </div>
                          <div className="input-item col-lg-3 col-md-6">
                            <label>Property Category Type</label>
                            <div className="input-item">
                              <Select
                                classNamePrefix="custom-select"
                                options={PROPERTY_CATEGORY_TYPES}
                                onChange={(e) => setPropertyCategoryTypeFilter(e) }
                                value={propertyCategoryTypeFilter}
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
          <div className="col-lg-8">
            <div className="ltn__faq-inner ltn__faq-inner-2">
              <div id="accordion_2">
                {!questions && questions.length === 0 ? (
                  <p>No Data!</p>
                ) : (
                  questions.map((element, i) => (
                    <div className="ltn__comment">
                      <div className="ltn__comment-title mb-3">
                        <Link to={ '/community-details/' + element.id }>{element.title}</Link>
                      </div>
                      <div className="ltn__comment-info">
                        <span className="ltn__comment-location">
                          <i class="fa-solid fa-user-tie"></i>
                          <div className="px-2">{element.name}</div>
                        </span>
                        <div className="ltn__comment-date">
                          <i class="fa-solid fa-calendar-days"></i>
                          <div className="px-2">
                            {new Date(element.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {questions && questions.length > 0 && (
                <div className="ltn__pagination-area text-center mt-5">
                  <div className="ltn__pagination">
                    <ul>
                      <li>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage !== 1) {
                              loadQuestions(currentPage - 1);
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
                                loadQuestions(i + 1);
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
                              loadQuestions(currentPage + 1);
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
          <div className="col-lg-4">
            <aside className="sidebar-area ltn__right-sidebar">
              {/* Form Widget */}
              <div className="widget ltn__form-widget">
                <h4 className="ltn__widget-title ltn__widget-title-border-2">
                  Drop a Question
                </h4>
                <form onSubmit={handleSubmit}>
                  <ResponseHandler errors={errors} success={success}/>
                  <div className="input-item">
                    <label>Category *</label>
                    <div className="input-item">
                      <Select
                        classNamePrefix="custom-select"
                        options={PRODUCT_CATEGORIES}
                        onChange={(e) => setCategory(e)}
                        value={category}
                        required
                      />
                    </div>
                  </div>
                  {
                    category && (
                      <div>
                        <div className="input-item">
                          <label>Property Type *</label>
                          <div className="input-item">
                            <Select
                              classNamePrefix="custom-select"
                              options={PROPERTY_TYPES}
                              onChange={(e) => setPropertyType(e)}
                              value={propertyType}
                              required
                            />
                          </div>
                        </div>
                        <div className="input-item">
                          <label>Property Category Type *</label>
                          <div className="input-item">
                            <Select
                              classNamePrefix="custom-select"
                              options={PROPERTY_CATEGORY_TYPES}
                              onChange={(e) => setPropertyCategoryType(e)}
                              value={propertyCategoryType}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }
                  <div className="input-item">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      placeholder="Your Name*"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                    />
                  </div>
                  <div className="input-item">
                    <label>Your Email *</label>
                    <input
                      type="email"
                      placeholder="Your E-Mail*"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </div>
                  <div className="input-item">
                    <label>Your Question *</label>
                    <textarea
                      placeholder="Your Question*"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      required
                    />
                  </div>
                  <button
                      disabled={loading}
                      type="submit"
                      className="btn theme-btn-1 btn-effect-1 text-uppercase ltn__z-index-m-1"
                    >
                      {loading ? (
                        <div className="lds-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
