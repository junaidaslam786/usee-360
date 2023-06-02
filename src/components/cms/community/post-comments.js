import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CmsService from "../../../services/cms";

export default function PostComments(props) {
  const [question, setQuestion] = useState();
  const [comments, setComments] = useState([]);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [comment, setComment] = useState();

  const params = useParams();

  const loadComments = async () => {
    const response = await CmsService.detailCommunityPost(params.id);

    setQuestion(response);
    setComments(response.cmsCommunityPostComments);
  }

  const addComment = async (e) => {
    e.preventDefault();

    const formResponse = await CmsService.addCommunityPostComment({
      communityPostId: params.id,
      name,
      email,
      comment,
    });   

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }
    
    if (formResponse) {
      setName("");
      setEmail("");
      setComment("");
      props.responseHandler("Comment posted successfully!", true);

      loadComments();
    }
  }

  useEffect(() => {
    const fetchAllComments = async () => {
      await loadComments();
    };

    fetchAllComments();
  }, []);

  return (
    <div className="ltn__faq-area mb-100">
      <div className="container">
        {
          question ? (
            <div className="row">
              <div className="col-lg-8">
                <div className="ltn__comment">
                  <div className="ltn__comment-title mb-3">
                    { question.title }
                  </div>
                  {
                    comments && comments.length === 0 ? (
                      <p className="comment-text">No Comments!</p>
                    ) : (
                      comments.map((element, i) => (
                        <div className="comment-text" key={i}>
                          <div className="mb-3 ltn__comment-date">
                            <div className="ltn__comment-info">
                              <span className="ltn__comment-location">
                              <i className="fa-solid fa-user-tie"></i>
                              <div className="px-2 text-dark">{ element.name }</div>
                              </span>
                            </div>
                            <div className="ltn__comment-date">
                              <i className="fa-solid fa-calendar-days"></i>
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
                      <i className="fa-solid fa-calendar-days"></i> {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            "Loading..."
          )
        }
      </div>
    </div>
  );
}
