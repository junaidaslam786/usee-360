import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CommunityDetails() {
  const [question, setQuestion] = useState({});
  const [comments, setComments] = useState([]);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [comment, setComment] = useState();
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const params = useParams();

  async function loadQuestion() {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/cms/single-post/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setQuestion(response.data);
        setComments(response.data.cmsCommunityPostComments);
      });
  }

  async function addComment(e) {
    e.preventDefault();

    const payload = {
      communityPostId: params.id,
      name,
      email,
      comment,
    };

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/cms/create-post-comment`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setName("");
        setEmail("");
        setComment("");
        setSuccessMessage(true);
        loadQuestion();

        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      })
      .catch(() => {
        setErrorMessage(true);

        setTimeout(() => {
          setErrorMessage(false);
        }, 3000);
      });
  }

  useEffect(() => {
    loadQuestion();
  }, []);

  return (
    <div className="ltn__faq-area mb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="ltn__comment">
              <div className="ltn__comment-title mb-3">
                {question.title}
              </div>
              {
                comments && comments.length === 0 ? (
                  <p className="comment-text">No Comments!</p>
                ) : (
                  comments.map((element, i) => (
                    <div className="comment-text" key={i}>
                      <div className="mb-3" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div className="ltn__comment-info">
                          <span className="ltn__comment-location">
                          <i class="fa-solid fa-user-tie"></i>
                          <div className="px-2 text-dark">{ element.name }</div>
                          </span>
                        </div>
                        <div className="ltn__comment-date">
                          <i class="fa-solid fa-calendar-days"></i>
                          <div className="px-2 text-dark">{new Date(element.createdAt).toLocaleDateString()}</div>
                        </div>
                        {/* <div>
                          <AiFillDelete size={24}/>
                        </div> */}
                      </div>
                      { element.comment }
                    </div>
                  ))
                )
              }

              <form className="mt-5" onSubmit={addComment}>
                {successMessage ? (
                  <div className="alert alert-success" role="alert">
                    Answer posted successfully!
                  </div>
                ) : null}
                {errorMessage ? (
                  <div className="alert alert-danger" role="alert">
                    Some error occurred!
                  </div>
                ) : null}
                <div className="row">
                  <div className="col-lg-6">
                    <input
                      type="text"
                      placeholder="Your Name*"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                    />
                  </div>
                  <div className="col-lg-6">
                    <input
                      type="email"
                      placeholder="Your E-Mail*"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Your Comment*"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  required
                />
                <button type="submit" className="btn theme-btn-1">
                  Send
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-4">
            <aside className="sidebar-area ltn__right-sidebar">
              <div className="widget ltn__form-widget">
                <h4 className="ltn__widget-title ltn__widget-title-border-2">
                  Posted by
                </h4>
                <div className="ltn__post-title mb-2">{question.name}</div>
                <div className="ltn__post-joined-date">
                  <i class="fa-solid fa-calendar-days"></i> {new Date(question.createdAt).toLocaleDateString()}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
