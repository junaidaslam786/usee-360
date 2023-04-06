import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import ResponseHandler from '../../global-components/respones-handler';

export default function UploadPropertyDocument(props) {
    const token = JSON.parse(localStorage.getItem("agentToken"));
    const [propertyDocuments, setPropertyDocuments] = useState([{ id: 0, title: '', file: null }]);
    const [newDocuments, setNewDocuments] = useState([{ title: '', file: null }]);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState("");
    const [loading, setLoading] = useState();

    const handleAddDocument = () => {
        setNewDocuments([...newDocuments, { title: '', file: null }])
    }

    const handleTitleChange = (index, event) => {
        const newPropertyDocuments = [...newDocuments];
        newPropertyDocuments[index].title = event.target.value;
        setNewDocuments(newPropertyDocuments);
    }

    const handleFileChange = (index, event) => {
        const newPropertyDocuments = [...newDocuments];
        newPropertyDocuments[index].file = event.target.files[0];
        setNewDocuments(newPropertyDocuments);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let countFiles = 0;
        const formData = new FormData();
        newDocuments.forEach((document) => {
            if (document.title && document.file) {
                formData.append("titles", document.title);
                formData.append("files", document.file);
                countFiles++;
            }
        });
        formData.append("productId", props.id);

        if (countFiles === 0) {
            setErrorHandler("please upload document first");
            return;
        }

        setLoading(true);
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
                setNewDocuments([{title: '', file: null}]);

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
        setLoading(false);
    }

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

                setSuccessHandler(response.data.message);
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
        if (props?.documents) 
            setPropertyDocuments(props.documents);
    }, [props.documents]);

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
            <ResponseHandler errors={uploadErrors} success={uploadSuccess}/>
            {
                propertyDocuments && (
                    propertyDocuments.map((element, index) => (
                        <div className="row mb-50 align-items-center" key={index}>
                            <div className="col-md-8">
                            <a
                                href={`${process.env.REACT_APP_API_URL}/${element.file}`}
                                target="_blank"
                                className="btn theme-btn-3 w-100 d-flex align-items-center text-highlight"
                            >
                                <i className="fa-solid fa-link me-2" />
                                {element.title}
                            </a>
                            </div>
                            <div className="col-md-4">
                                <button type="button" className="p-2 rounded-1 theme-btn-3" onClick={() => handleFileDelete(element.id)}><i className="fa-solid fa-trash d-flex"></i></button>
                            </div>
                        </div>
                    )
                )
            )}
            <form onSubmit={handleSubmit}>
                {
                    newDocuments && (
                        newDocuments.map((element, index) => (
                            <div className="row mb-50 align-items-center" key={index}>
                                <div className="col-md-4">
                                    <div className="input-item">
                                        <input 
                                            className="mb-0"
                                            type="text"
                                            value={element.title}
                                            onChange={(event) => handleTitleChange(index, event) }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <input type="file" className="btn theme-btn-3 w-100" key={Date.now()} onChange={(event) => handleFileChange(index, event) }/>
                                </div>
                                {
                                    index === newDocuments.length - 1 && (
                                        <div className="col-md-2 d-flex">
                                            <button
                                                type="button"
                                                className="p-2 rounded-1 theme-btn-3"
                                                onClick={handleAddDocument}
                                            >
                                            <i className="fa-solid fa-square-plus d-flex "></i>
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    )
                )}
               
                <button
                    disabled={loading}
                    type="submit"
                    className="btn theme-btn-1 btn-effect-1 text-uppercase ltn__z-index-m-1"
                >
                    {loading ? (
                        <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        </div>
                    ) : (
                        "Upload Documents"
                    )}
                </button>
            </form>
            {/* <div className="row mb-50">
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
            </div> */}
        </div>
    );
}