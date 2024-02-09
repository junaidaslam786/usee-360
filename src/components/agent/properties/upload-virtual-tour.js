import React, { useState, useEffect } from "react";
import PropertyService from "../../../services/agent/property";
import { toast } from "react-toastify";
import LinearProgressBar from "./linearProgressBar";

const UploadVirtualTour = ({ propertyId, onUploadSuccess }) => {
  const [virtualTourFile, setVirtualTourFile] = useState(null);
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [virtualTourType, setVirtualTourType] = useState("");
  const [useSlideshow, setUseSlideshow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const checkHandler = () => {
    setUseSlideshow(!useSlideshow);
    // Reset states when toggling slideshow option
    setVirtualTourFile(null);
    setVirtualTourUrl("");
  };

  
  const vrTourVideoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVirtualTourFile(file);
      setVirtualTourUrl(""); 
      setVirtualTourType("video"); 
    }
  };

  const vrTourUrlHandler = (e) => {
    setVirtualTourUrl(e.target.value);
    setVirtualTourFile(null); // Clear file if URL is provided
    setVirtualTourType("url"); // Set virtualTourType to "url"
  };

  // Adjust handleSubmit to check for virtualTourType and append formData correctly
  const handleSubmit = async () => {
    setLoading(true);
    setUploadProgress(0);
  
    let formData = new FormData();
    formData.append("productId", propertyId);
    formData.append("virtualTourType", virtualTourType);
  
    if (virtualTourType === "video" && virtualTourFile) {
      // Add here any file validation if necessary
      formData.append("virtualTourVideo", virtualTourFile);
    } else if (virtualTourType === "url") {
      // Add here any URL validation if necessary
      formData.append("virtualTourUrl", virtualTourUrl);
    }
  
    try {
      const response = await PropertyService.uploadVirtualTour(
        formData,
        progress => setUploadProgress(progress)
        
      );
      if (response.error) {
        toast.error(response.message || "Unable to upload virtual tour, please try again later.");
      } else {
        toast.success("Virtual tour uploaded successfully.");
        onUploadSuccess(response); // Call the callback with the response
      }
    } catch (error) {
      console.error("Error uploading virtual tour:", error);
      toast.error("An error occurred while uploading the virtual tour.");
    } finally {
      setLoading(false);
      setUploadProgress(0); 
    }
  };
  
  

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setAnimatedProgress((prev) => {
          if (prev < uploadProgress) {
            return Math.min(prev + 1, uploadProgress);
          }
          clearInterval(interval);
          return prev;
        });
      }, 30); // Adjust time for smoother or faster animation
      return () => clearInterval(interval);
    }
  }, [loading, uploadProgress, animatedProgress]);
  

 

  return (
    <>
      <h4 className="title-2">Upload VR Tour</h4>
      <div className="row mb-custom">
        <div className="col-md-12">
          <div className="input-item">
            {/* <label>VR Tour Video File:</label> */}
            <input
              type="file"
              className="btn theme-btn-3 mb-10"
              onChange={vrTourVideoHandler}
              disabled={loading || useSlideshow}
            />
          </div>
          <h5 className="mt-10">OR</h5>
          <div className="input-item">
            <label>VR Tour URL:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Property VR URL"
              value={virtualTourUrl}
              onChange={vrTourUrlHandler}
              disabled={loading || useSlideshow || virtualTourFile}
            />
          </div>
          <div className="mb-30">
            <label className="checkbox-item">
              Use images to create a slideshow instead of uploading a virtual
              tour:
              <input
                type="checkbox"
                checked={useSlideshow}
                onChange={checkHandler} // Use checkHandler here
                disabled={loading}
              />
              <span className="checkmark"></span>
            </label>
          </div>
          {loading && (
            <div className="mb-20">
              <LinearProgressBar progress={animatedProgress} />
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading || (useSlideshow && !virtualTourFile && !virtualTourUrl)
            }
            className="btn theme-btn-1 btn-effect-1 text-uppercase mt-3"
          >
            {loading ? "Uploading..." : "Upload Virtual Tour"}
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadVirtualTour;
