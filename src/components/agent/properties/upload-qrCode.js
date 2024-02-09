import React, { useState, useEffect } from "react";
import PropertyService from "../../../services/agent/property";
import { toast } from "react-toastify";
import { set } from "lodash";
import LinearProgressBar from "./linearProgressBar";

const UploadQrCode = ({
  propertyId,
  onQrCodeUploadSuccess,
  onUploadSuccess,
}) => {
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCodePreviewUrl, setQrCodePreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Handle QR code file selection
  const handleQrCodeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrCodeFile(file);
      const previewUrl = URL.createObjectURL(file);
      setQrCodePreviewUrl(previewUrl); // Set preview URL to display the image
      uploadQrCode(file); // Automatically upload after selection
    }
  };

  // Upload QR code
  const uploadQrCode = async (file) => {
    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("qrCode", file);
    formData.append("productId", propertyId);

    try {
      const response = await PropertyService.uploadQRCode(
        formData,
        (progress) => setUploadProgress(progress)
      );

      if (response.error) {
        toast.error("Failed to upload QR code.");
      } else {
        // toast.success("QR code uploaded successfully.");
        onQrCodeUploadSuccess(response.qrCodePath);
        onUploadSuccess(response);
      }
    } catch (error) {
      setLoading(false);
      setUploadProgress(0);
      toast.error("An error occurred during QR code upload.");
      console.error("Upload QR Code Error:", error);
    }
  };

  useEffect(() => {
    const fetchQrCode = async () => {
      if (propertyId) {
        try {
          // Assuming the detail method returns property details including the QR code
          const response = await PropertyService.detail(propertyId);
          console.log("response", response);
          if (response && response.qrCode) {
            // Assuming response.qrCode is the path to the QR code image
            setQrCodePreviewUrl(
              `${process.env.REACT_APP_API_URL}/${response.qrCode}`
            );
          }
        } catch (error) {
          console.error("Error fetching QR code:", error);
          // Optionally handle error, e.g., set a fallback image or display an error message
        }
      }
    };

    fetchQrCode();
  }, [propertyId]);

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

  // Cleanup preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      qrCodePreviewUrl && URL.revokeObjectURL(qrCodePreviewUrl);
    };
  }, [qrCodePreviewUrl]);

  return (
    <div className="row">
      <div className="col-md-12">
        <h4 className="title-2">Permit Number QR Code</h4>
        <input
          type="file"
          className="btn theme-btn-3 mb-10"
          onChange={handleQrCodeChange}
          accept="image/png, image/jpeg"
        />
        <small className="form-text text-muted">
          {" "}
          (Supported formats: jpg, png).
        </small>
        {qrCodePreviewUrl && (
          <img
            src={qrCodePreviewUrl}
            alt="QR Code Preview"
            style={{ maxWidth: "50%", height: "auto" }}
          />
        )}
        {loading && (
          <div className="mb-20">
            <LinearProgressBar progress={animatedProgress} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadQrCode;
