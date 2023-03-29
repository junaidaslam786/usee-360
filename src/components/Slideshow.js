import React from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const Slideshow = (props) => {

  const { fadeImages } = props;
  console.log(fadeImages);

  return (
    <div className="slide-container">
      <Fade>
        {fadeImages.map((fadeImage, index) => (
          <div key={index}>
            <img style={{ width: '100%' }} src={`http://localhost:8000/${fadeImage.image}`} />
          </div>
        ))}
      </Fade>
    </div>
  )
}

export default Slideshow;
