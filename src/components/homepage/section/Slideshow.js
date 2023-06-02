import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const Slideshow = (props) => {
  const { fadeImages } = props;

  return (
    <div className="slide-container mb-4 w-100">
      <Slide>
        {fadeImages.map((fadeImage, index) => (
          <div key={index}>
            <img
            className="w_100"
              src={`${process.env.REACT_APP_API_URL}/${fadeImage.image}`}
            />
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default Slideshow;
