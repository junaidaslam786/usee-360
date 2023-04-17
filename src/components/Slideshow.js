import React from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const Slideshow = (props) => {
  const { fadeImages } = props;

  return (
    <div className="slide-container mb-4 w-100">
      <Fade>
        {fadeImages.map((fadeImage, index) => (
          <div key={index}>
            <img
              style={{ width: "100%" }}
              src={`${process.env.REACT_APP_API_URL}/${fadeImage.image}`}
            />
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default Slideshow;
