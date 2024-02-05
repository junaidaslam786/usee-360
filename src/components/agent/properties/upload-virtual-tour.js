import React, { useState, useEffect } from "react";
import PropertyService from "../../../services/agent/property";
import { toast } from "react-toastify";

const UploadVirtualTour = ({ propertyId, onUploadSuccess }) => {
  const [virtualTourFile, setVirtualTourFile] = useState(null);
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [virtualTourType, setVirtualTourType] = useState(""); 
  const [useSlideshow, setUseSlideshow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const checkHandler = () => {
    setUseSlideshow(!useSlideshow);
  };

  // Adjust handlers for file and URL inputs to set the virtualTourType accordingly
  const vrTourVideoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVirtualTourFile(file);
      setVirtualTourUrl(""); // Clear URL if file is chosen
      setVirtualTourType("video"); // Set virtualTourType to "video"
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
    formData.append("virtualTourType", virtualTourType); // Append virtualTourType

    if (virtualTourType === "video" && virtualTourFile) {
      formData.append("virtualTourVideo", virtualTourFile); // Append file for "video" type
    } else if (virtualTourType === "url") {
      formData.append("virtualTourUrl", virtualTourUrl); // Append URL for "url" type
    }

    try {
      const response = await PropertyService.uploadVirtualTour(
        formData,
        (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      );
      if (response.error) {
        toast.error(
          response.message ||
            "Unable to upload virtual tour, please try again later."
        );
      } else {
        toast.success("Virtual tour uploaded successfully.");
        onUploadSuccess(response); // Call the callback with the response
      }
    } catch (error) {
      console.error("Error uploading virtual tour:", error);
      toast.error("An error occurred while uploading the virtual tour.");
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset progress after upload
    }
  };

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
              Use images to create a slideshow instead of uploading a virtual tour:
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
            <div>
              <label>Upload Progress:</label>
              <progress
                value={uploadProgress}
                max="100"
                className="w-100"
              ></progress>
              <span className="ms-2">{uploadProgress}%</span>
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
