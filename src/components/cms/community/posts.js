import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  PRODUCT_CATEGORIES,
  PROPERTY_TYPES,
  PROPERTY_CATEGORY_TYPES,
} from "../../../constants";
import CmsService from "../../../services/cms";
import { useParams } from "react-router-dom";

export default function Posts(props) {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [questions, setQuestions] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();

  const loadQuestions = async (page) => {
    let payload = {
      page,
      size: 20,
      communityId: params.id
    };

    const response = await CmsService.listCommunityPosts(payload);
    if (response?.data) {
      setQuestions(response.data);
      setCurrentPage(parseInt(response.page));
      setTotalPages(parseInt(response.totalPage));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("name", name.trim());
    formdata.append("email", email.trim());
    formdata.append("title", title.trim());
    formdata.append("communityId", params.id);

    setLoading(true);
    const formResponse = await CmsService.addCommunityPost(formdata);       
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }
    
    if (formResponse) {
      props.responseHandler("Question posted successfully", true);
      setName("");
      setEmail("");
      setTitle("");
      loadQuestions();
    }
  }

  useEffect(() => {
    const fetchAllQuestions = async () => {
      await loadQuestions();
    };

    fetchAllQuestions();
  }, []);

  return (
    <div className="ltn__faq-area mb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="ltn__faq-inner ltn__faq-inner-2">
              <div id="accordion_2">
                {
                  (!questions || questions?.length === 0) ? (
                    <p>No Questions Yet!</p>
                  ) : (
                    questions.map((element, i) => (
                      <div className="ltn__comment" key={i}>
                        <div className="ltn__comment-title mb-3">
                          <Link to={ '/community-post-comments/' + element.id }>{element.title}</Link>
                        </div>
                        <div className="ltn__comment-info">
                          <span className="ltn__comment-location">
                            <i className="fa-solid fa-user-tie"></i>
                            <div className="px-2">{element.name}</div>
                          </span>
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
              {
                (questions && questions.length > 0) && (
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
                                    loadQuestions(i + 1);
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
                )
              }
            </div>
          </div>
          <div className="col-lg-4">
            <aside className="sidebar-area ltn__right-sidebar">
              <div className="widget ltn__form-widget">
                <h4 className="ltn__widget-title ltn__widget-title-border-2">
                  Drop a Question
                </h4>
                <form onSubmit={handleSubmit}>
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
                      {
                        loading ? (
                          <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        ) : (
                          "Submit"
                        )
                      }
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
