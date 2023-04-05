import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "react-dropzone";
import axios from 'axios';
import ResponseHandler from '../../global-components/respones-handler';

export default function UploadPropertyDocument(props) {
    const token = JSON.parse(localStorage.getItem("agentToken"));
    const [propertyDocuments, setPropertyDocuments] = useState([]);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState("");

    const onDocumentsDrop = useCallback(async (acceptedFiles) => {
        console.log('acceptedFiles', acceptedFiles);
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("productId", props.id);
        
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/property/document`, 
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
                    setErrorHandler("Unable to upload documents, please try again later");
                }

                console.log('upload-document-response', response);
                setSuccessHandler("Documents uploaded successfully");

                setPropertyDocuments(response.data);
                return response.data;
            }).catch(error => {
                console.log('upload-document-error', error);
                if (error?.response?.data?.errors) {
                    setErrorHandler(error.response.data.errors, "error", true);
                } else if (error?.response?.data?.message) { 
                    setErrorHandler(error.response.data.message);
                } else {
                    setErrorHandler("Unable to upload documents, please try again later");
                }
            });
        } catch (error) {
            console.log('upload-document-error', error);
            if (error?.response?.data?.errors) {
                setErrorHandler(error.response.data.errors, "error", true);
            } else if (error?.response?.data?.message) { 
                setErrorHandler(error.response.data.message);
            } else {
                setErrorHandler("Unable to upload documents, please try again later");
            }
        }
    }, []);
    
    const handleFileDelete = async (fileId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/property/document`, 
                {
                    data: {
                        "productId": props.id,
                        "documentId": fileId
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }, 
            ).then((response) => {
                if (response?.status !== 200) {
                    setErrorHandler("Unable to delete document, please try again later");
                }

                const currentDocuments = [...propertyDocuments];
                const deletedFileIndex = currentDocuments.findIndex((document) => document.id === fileId);
                currentDocuments.splice(deletedFileIndex, 1);

                setPropertyDocuments(currentDocuments);
                return response.data;
            }).catch(error => {
                console.log('delete-document-error', error);
                if (error?.response?.data?.errors) {
                    setErrorHandler(error.response.data.errors, "error", true);
                } else if (error?.response?.data?.message) { 
                    setErrorHandler(error.response.data.message);
                } else {
                    setErrorHandler("Unable to delete document, please try again later");
                }
            });
        } catch (error) {
            console.log('upload-document-error', error);
            if (error?.response?.data?.errors) {
                setErrorHandler(error.response.data.errors, "error", true);
            } else if (error?.response?.data?.message) { 
                setErrorHandler(error.response.data.message);
            } else {
                setErrorHandler("Unable to delete document, please try again later");
            }
        }
    }

    useEffect(() => {
        if (props?.Documents) 
            setPropertyDocuments(props.Documents);
    }, [props.Documents]);

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
            <h4 className="title-2">Upload Documents</h4>
            <div className="row mb-50">
              <div className="col-md-8">
                <div className="input-item">
                  <label>Brochure</label>
                  <input type="file" className="btn theme-btn-3 mb-10" />
                </div>
              </div>
              <div className="col-md-8">
                <div className="input-item">
                  <label>Floor Plan</label>
                  <input type="file" className="btn theme-btn-3 mb-10" />
                </div>
              </div>
              <div className="col-md-8 mb-20">
                <div className="input-item">
                  <label>More Documents</label>
                </div>
              </div>
            </div>
        </div>
    );
}