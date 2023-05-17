import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function NewsDetails() {
  let publicUrl = process.env.PUBLIC_URL + "/";

  const [news, setNews] = useState({});
  const params = useParams();

  async function loadNews() {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/cms/single-page/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setNews(response.data);
      });
  }

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="ltn__page-details-area ltn__blog-details-area mb-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__blog-details-wrap">
              <div className="ltn__page-details-inner ltn__blog-details-inner">
                <div className="ltn__blog-meta">
                  <div className="ltn__blog-img">
                    <img src={ process.env.REACT_APP_API_URL + "/" + news.featuredImageFile } alt="#" />
                  </div>
                </div>
                <h2 className="ltn__blog-title">{news.title}</h2>
                <div className="ltn__blog-meta">
                  <ul>
                    <li className="ltn__blog-author go-top">
                      <img
                        src={publicUrl + "assets/img/blog/author.jpg"}
                        alt="#"
                      />
                      By: Admin
                    </li>
                    <li className="ltn__blog-date">
                      <i className="far fa-calendar-alt" />
                      {new Date(news.createdAt).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
                <p dangerouslySetInnerHTML={{ __html: news.description }} />
                {
                  news?.file && (
                    <div className="row">
                      <a href={process.env.REACT_APP_API_URL + "/" + news.file} target="blank" className="btn theme-btn-1 mb-3 w-25">Download</a>
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
