import React, { useState, useEffect } from "react";
import PropertyService from "../../../services/agent/property";
import { toast } from "react-toastify";

const UploadQrCode = ({ propertyId, onQrCodeUploadSuccess }) => {
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [qrCodePreviewUrl, setQrCodePreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

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
    const formData = new FormData();
    formData.append("qrCode", file);
    formData.append("productId", propertyId);

    try {
      const response = await PropertyService.uploadQRCode(
        formData,
        (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      );

      if (response.error) {
        toast.error("Failed to upload QR code.");
      } else {
        toast.success("QR code uploaded successfully.");
        onQrCodeUploadSuccess(response.qrCodePath);
      }
    } catch (error) {
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
        {uploadProgress > 0 && (
          <div
            style={{
              height: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "5px",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,.1)",
              marginTop: "10px", // Adds some space between the label and the progress bar
              width: "100%", // Ensures the container takes full width
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${uploadProgress}%`,
                backgroundColor: uploadProgress === 100 ? "#28a745" : "#007bff", // Changes color to green when complete
                borderRadius: "5px",
                textAlign: "center",
                color: "white",
                lineHeight: "20px", // Adjust to match the height of the progress bar
                transition: "width 0.6s ease",
              }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadQrCode;
