import React, { useState } from "react";
import PropertyService from "../../../services/agent/property";
import { toast } from "react-toastify";

const UploadVirtualTour = ({ propertyId, onUploadSuccess }) => {
  const [virtualTourFile, setVirtualTourFile] = useState(null);
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [useSlideshow, setUseSlideshow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Add state to track upload progress

  const vrTourVideoHandler = (e) => {
    setVirtualTourFile(e.target.files[0]);
  };

  const vrTourUrlHandler = (e) => {
    setVirtualTourUrl(e.target.value);
  };

  const checkHandler = () => {
    setUseSlideshow(!useSlideshow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (useSlideshow) {
      toast.info("Slideshow creation is not yet implemented.");
      return;
    }

    setLoading(true);
    let formData = new FormData();
    formData.append("productId", propertyId);
    if (virtualTourFile) {
      formData.append("virtualTourFile", virtualTourFile);
    } else {
      formData.append("virtualTourUrl", virtualTourUrl);
    }

    try {
      // Use the service with progress tracking
      await PropertyService.uploadVirtualTour(formData, (progress) =>
        setUploadProgress(progress)
      )
        .then((response) => {
          if (response.error) {
            toast.error(
              response.message ||
                "Unable to upload virtual tour, please try again later."
            );
          } else {
            toast.success("Virtual tour uploaded successfully.");
            onUploadSuccess(); // Invoke the callback
          }
        })
        .catch((error) => {
          console.error("Error uploading virtual tour:", error);
          toast.error("An error occurred while uploading the virtual tour.");
        });
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset progress after the operation
    }
  };

  return (
    <>
      <h4 className="title-2">Upload VR Tour</h4>
      <div className="row mb-custom">
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            <div className="input-item">
              <input
                type="file"
                className="btn theme-btn-3 mb-10"
                onChange={vrTourVideoHandler}
              />
            </div>
            <h5 className="mt-10">OR</h5>
            <div className="col-md-12">
              <div className="input-item">
                <input
                  type="text"
                  placeholder="Property VR URL"
                  value={virtualTourUrl}
                  onChange={vrTourUrlHandler}
                />
              </div>
            </div>
            <div className="col-md-12 mb-30">
              <label className="checkbox-item">
                Use the images to create a video slideshow instead of using
                virtual tour
                <input
                  type="checkbox"
                  checked={useSlideshow}
                  onChange={checkHandler}
                />
                <span className="checkmark" />
              </label>
            </div>
            {loading && (
              <div>
                <progress value={uploadProgress} max="100"></progress>
                <span>{uploadProgress}%</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn theme-btn-1 btn-effect-1 text-uppercase"
            >
              {loading ? "Uploading..." : "Upload Virtual Tour"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadVirtualTour;
