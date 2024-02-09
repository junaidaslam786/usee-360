import React, { useCallback, useEffect, useState } from "react";
import PropertyService from "../../../services/agent/property";
import { toast } from "react-toastify";
import LinearProgressBar from "./linearProgressBar";

const UploadFeaturedImage = ({ propertyId, onImageSelect, setProperty, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFeatureImage, setSelectedFeatureImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const fetchFeaturedImage = async () => {
      if (propertyId) {
        try {
          const response = await PropertyService.detail(propertyId);
          if (response && response.featuredImage) {
            setImagePreviewUrl(
              `${process.env.REACT_APP_API_URL}/${response.featuredImage}`
            );
          }
        } catch (error) {
          console.error("Error fetching property details:", error);
          // Handle error or set fallback image
        }
      }
    };

    fetchFeaturedImage();
  }, [propertyId]);

  // Automatically upload image when selectedFeatureImage changes and is not null
  useEffect(() => {
    if (selectedFeatureImage) {
      uploadImage(); // Triggers upload when an image is selected
    }
  }, [selectedFeatureImage]); // Dependency array includes selectedFeatureImage

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFeatureImage(file);
      onImageSelect(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const uploadImage = useCallback(async () => {
    if (!selectedFeatureImage) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("featuredImage", selectedFeatureImage);
    formData.append("productId", propertyId);

    try {
      const response = await PropertyService.uploadFeatureImage(
        formData,
        progress => setUploadProgress(progress)
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
        onUploadSuccess(response);
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file.");
      setLoading(false);
      setUploadProgress(0);
    }
    // } finally {
    //   setLoading(false);
    //   setUploadProgress(0);
    // }
  }, [selectedFeatureImage, propertyId, setProperty]);

  // Cleanup the image preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviewUrl && URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

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
    <div className="row mb-custom">
      <h4 className="title-2">Featured Image</h4>
      <div className="col-md-12">
        <div className="input-item">
          <input
            type="file"
            className="btn theme-btn-3 mb-10 positionRevert"
            onChange={handleImageChange}
          />
          <br />
          

          <p>
            <small>
              * At least 1 image is required for a valid submission. Minimum
              size is 500/500px.
            </small>
            <br />
            <small>* Supports JPG, JPEG, and PNG formats.</small>
            <br />
            <small>* Images might take longer to be processed.</small>
          </p>
        </div>
        {imagePreviewUrl && (
          <img
            className="featuredImagePreview"
            src={imagePreviewUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "300px" }} // Adjust the styling as needed
          />
        )}
        {loading && (
            <div className="mb-20">
              <LinearProgressBar progress={animatedProgress} />
            </div>
          )}
        {/* {loading && <p>Uploading...</p>} */}
        {error && <div>{error}</div>}
      </div>
    </div>
  );
};

export default UploadFeaturedImage;
