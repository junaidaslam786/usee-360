import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "react-dropzone";
import PropertyService from "../../../services/agent/property";
import { on } from "@opentok/client";
import { set } from "lodash";
import LinearProgressBar from "./linearProgressBar";

export default function UploadPropertyImage(props) {
  const [propertyImages, setPropertyImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const onImagesDrop = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("files", file);
      });
      setLoading(true);
      setUploadProgress(0);
      formData.append("productId", props.id);

      try {
        const formResponse = await PropertyService.uploadImage(
          formData,
          (progress) => setUploadProgress(progress)
        );

        if (formResponse?.error && formResponse?.message) {
          props.responseHandler(formResponse.message);
          setUploadProgress(0);
        } else {
          props.responseHandler("Images uploaded successfully", true);
          if (isComponentMounted) {
            setPropertyImages(formResponse);
          }
          props.onUploadSuccess(formResponse);
        }
      } catch (error) {
        console.error("Upload Image Error:", error);
        setUploadProgress(0);
        setLoading(false);
      }
    },
    [props.id, props.responseHandler, isComponentMounted]
  );

  const handleFileDelete = async (fileId) => {
    const formResponse = await PropertyService.deleteImage({
      productId: props.id,
      imageId: fileId,
    });

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    const currentImages = [...propertyImages];
    const deletedFileIndex = currentImages.findIndex(
      (image) => image.id === fileId
    );
    currentImages.splice(deletedFileIndex, 1);

    setPropertyImages(currentImages);
    props.responseHandler(formResponse.message, true);
  };

  useEffect(() => {
    setIsComponentMounted(true);
    if (props?.images) {
      setPropertyImages(props.images);
    }

    return () => {
      setIsComponentMounted(false);
    };
  }, [props.images]);

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
    <React.Fragment>
      <h4 className="title-2">Add More Images</h4>
      <div className="row mb-50">
        <div className="col-md-12 dropzone">
          <Dropzone onDrop={onImagesDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone-area">
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            )}
          </Dropzone>
        </div>
      </div>

      <div className="row mb-50">
        {Object.keys(uploadProgress).map((fileName, index) => (
          <div className="col-md-4" key={index}>
            <p>{fileName}</p>
            <progress value={uploadProgress[fileName]} max="100"></progress>
          </div>
        ))}
      </div>

      <div className="row mb-50">
        {propertyImages.map((file, index) => (
          <div className="col-md-4" key={index}>
            <div>
              <img
                width="150px"
                height="130px"
                src={`${process.env.REACT_APP_API_URL}/${file.image}`}
                alt={`Property Image ${index}`}
              />
            </div>
            <button type="button" onClick={() => handleFileDelete(file.id)}>
              Remove File
            </button>
          </div>
        ))}
      </div>
      {loading && (
        <div className="mb-20">
          <LinearProgressBar progress={animatedProgress} />
        </div>
      )}
    </React.Fragment>
  );
}
