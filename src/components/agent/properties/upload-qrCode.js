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
    formData.append("propertyId", propertyId);

    try {
      const response = await PropertyService.uploadQrCode(
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

  // Cleanup preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      qrCodePreviewUrl && URL.revokeObjectURL(qrCodePreviewUrl);
    };
  }, [qrCodePreviewUrl]);

  return (
    <div>
      <input
        type="file"
        onChange={handleQrCodeChange}
        accept="image/png, image/jpeg"
      />
      {qrCodePreviewUrl && (
        <img src={qrCodePreviewUrl} alt="QR Code Preview" style={{ maxWidth: "100%", height: "auto" }} />
      )}
      {uploadProgress > 0 && (
        <progress value={uploadProgress} max="100">{uploadProgress}%</progress>
      )}
    </div>
  );
};

export default UploadQrCode;
