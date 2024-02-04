import React from "react";
import PropertyService from "../../../services/agent/property";

const UploadFeaturedImage = ({ propertyId, setProperty }) => {
  const [image, setImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("files", image);
    formData.append("productId", propertyId);

    const response = await PropertyService.uploadFeatureImage(
      formData,
      (progress) => {
        setUploadProgress(progress); // Update progress state
      }
    );

    if (response?.error) {
      setError(
        response?.error?.message ||
          "Unable to upload featured image, please try again later"
      );
      setUploadProgress(0);
    } else {
      setProperty((prevState) => ({
        ...prevState,
        featuredImage: response.featuredImage,
      }));
      setUploadProgress(100);
    }

    setLoading(false);
  };

  return (
    <div className="row mb-custom">
      <div className="col-md-12">
        <div className="input-item">
          <input
            type="file"
            className="btn theme-btn-3 mb-10 positionRevert"
            onChange={handleImage}
          />
          <br />
          {uploadProgress > 0 && (
            <progress value={uploadProgress} max="100">
              {uploadProgress}%
            </progress> 
          )}
          <p>
            <small>
              * At least 1 image is required for a valid submission. Minimum
              size is 500/500px.
            </small>
            <br />
            <small>* Supports JPG, JPEG and PNG formats.</small>
            <br />
            <small>* Images might take longer to be processed.</small>
          </p>
        </div>
        <button onClick={uploadImage} disabled={loading || !image}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        {error && <div>{error}</div>}

        {/* {featuredImagePreview && (
              <img
                className="featuredImageCss"
                src={featuredImagePreview}
                alt={title}
                width="300px"
              />
            )} */}
      </div>
    </div>
  );
};
export default UploadFeaturedImage;
