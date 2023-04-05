import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "react-dropzone";
import axios from 'axios';
import ResponseHandler from '../../global-components/respones-handler';

export default function UploadPropertyImage(props) {
    const token = JSON.parse(sessionStorage.getItem("agentToken"));
    const [propertyImages, setPropertyImages] = useState([]);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState("");

    const onImagesDrop = useCallback(async (acceptedFiles) => {
        console.log('acceptedFiles', acceptedFiles);
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("productId", props.id);
        
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/property/image`, 
                formData, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (ProgressEvent) => {
                        // setProgress(Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100))
                    }
                }
            ).then((response) => {
                if (response?.status !== 200) {
                    setErrorHandler("Unable to upload images, please try again later");
                }

                console.log('upload-image-response', response);
                setSuccessHandler("Images uploaded successfully");

                setPropertyImages(response.data);
                return response.data;
            }).catch(error => {
                console.log('upload-image-error', error);
                if (error?.response?.data?.errors) {
                    setErrorHandler(error.response.data.errors, "error", true);
                } else if (error?.response?.data?.message) { 
                    setErrorHandler(error.response.data.message);
                } else {
                    setErrorHandler("Unable to upload images, please try again later");
                }
            });
        } catch (error) {
            console.log('upload-image-error', error);
            if (error?.response?.data?.errors) {
                setErrorHandler(error.response.data.errors, "error", true);
            } else if (error?.response?.data?.message) { 
                setErrorHandler(error.response.data.message);
            } else {
                setErrorHandler("Unable to upload images, please try again later");
            }
        }
    }, []);
    
    const handleFileDelete = async (fileId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/property/image`, 
                {
                    data: {
                        "productId": props.id,
                        "imageId": fileId
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }, 
            ).then((response) => {
                if (response?.status !== 200) {
                    setErrorHandler("Unable to delete image, please try again later");
                }

                const currentImages = [...propertyImages];
                const deletedFileIndex = currentImages.findIndex((image) => image.id === fileId);
                currentImages.splice(deletedFileIndex, 1);

                setPropertyImages(currentImages);
                return response.data;
            }).catch(error => {
                console.log('delete-image-error', error);
                if (error?.response?.data?.errors) {
                    setErrorHandler(error.response.data.errors, "error", true);
                } else if (error?.response?.data?.message) { 
                    setErrorHandler(error.response.data.message);
                } else {
                    setErrorHandler("Unable to delete image, please try again later");
                }
            });
        } catch (error) {
            console.log('upload-image-error', error);
            if (error?.response?.data?.errors) {
                setErrorHandler(error.response.data.errors, "error", true);
            } else if (error?.response?.data?.message) { 
                setErrorHandler(error.response.data.message);
            } else {
                setErrorHandler("Unable to delete image, please try again later");
            }
        }
    }

    useEffect(() => {
        if (props?.images) 
            setPropertyImages(props.images);
      }, [props.images]);

      const setErrorHandler = (msg, param = "form", fullError = false) => {
        setUploadErrors(fullError ? msg : [{ msg, param }])
        setTimeout(() => {
            setUploadErrors([]);
        }, 3000);
        setUploadSuccess("");
    }
    
    const setSuccessHandler = (msg) => {
        setUploadSuccess(msg)
        setTimeout(() => {
            setUploadSuccess("");
        }, 3000);
        
        setUploadErrors([]);
    }

    return ( 
        <div>
            <h4 className="title-2">Add More Images</h4>
            <ResponseHandler errors={uploadErrors} success={uploadSuccess}/>
            <div className="row mb-50">
                <div className="col-md-12 dropzone">
                    <Dropzone onDrop={onImagesDrop} >
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()}/>
                                {
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                }
                            </div>
                        )}
                    </Dropzone>
                </div>
            </div>
            <div className="row mb-50">
                {
                    propertyImages && propertyImages.map((file, index) => ( 
                        <div className="col-md-4" key={file.id}>
                            <div><img width="150px" height="130px" src={ `${process.env.REACT_APP_API_URL}/${file.image}` }></img></div>
                            <button type="button" onClick={ () => handleFileDelete(file.id) }>Remove File</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}