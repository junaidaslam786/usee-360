import React, { useState, useEffect, useRef } from "react";
import PropertyService from "../../../services/agent/property";

export default function UploadPropertyDocument(props) {
  const [propertyDocuments, setPropertyDocuments] = useState([
    { id: 0, title: "", file: null },
  ]);
  const [newDocuments, setNewDocuments] = useState([{ title: "", file: null }]);
  const [loading, setLoading] = useState();
  const file = useRef();

  const handleAddDocument = () => {
    setNewDocuments([...newDocuments, { title: "", file: null }]);
  };

  const handleTitleChange = (index, event) => {
    const newPropertyDocuments = [...newDocuments];
    newPropertyDocuments[index].title = event.target.value;
    setNewDocuments(newPropertyDocuments);
  };

  const handleFileChange = (index, event) => {
    const newPropertyDocuments = [...newDocuments];
    newPropertyDocuments[index].file = event.target.files[0];
    setNewDocuments(newPropertyDocuments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let countFiles = 0;
    let isDocumentNameMissing = false;
    const formData = new FormData();
    newDocuments.forEach((document) => {
      if (!document.title) {
        isDocumentNameMissing = true;
        return;
      }

      if (!document.file) {
        return;
      }

      formData.append("titles", document.title);
      formData.append("files", document.file);
      countFiles++;
    });
    formData.append("productId", props.id);

    if (countFiles === 0) {
      props.responseHandler(
        isDocumentNameMissing
          ? ["Document name is required."]
          : ["Please upload document"]
      );
      return;
    }

    setLoading(true);
    const formResponse = await PropertyService.uploadDocument(formData);
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    props.responseHandler("Documents uploaded successfully", true);
    setPropertyDocuments(formResponse);
    setNewDocuments([{ title: "", file: null }]);

    file.current.value = "";
  };

  const handleFileDelete = async (fileId) => {
    const formResponse = await PropertyService.deleteDocument({
      productId: props.id,
      documentId: fileId,
    });

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    const currentDocuments = [...propertyDocuments];
    const deletedFileIndex = currentDocuments.findIndex(
      (document) => document.id === fileId
    );
    currentDocuments.splice(deletedFileIndex, 1);

    setPropertyDocuments(currentDocuments);
    props.responseHandler(formResponse.message, true);
  };

  useEffect(() => {
    if (props?.documents) {
      setPropertyDocuments(props.documents);
    }
  }, [props.documents]);

  return (
    <div>
      <h4 className="title-2">Upload Documents (Use PDF, JPEG, PNG files)</h4>
      {propertyDocuments &&
        propertyDocuments.map((element, index) => (
          <div className="row mb-50 align-items-center" key={index}>
            <div className="col-md-8">
              <a
                href={`${process.env.REACT_APP_API_URL}/${element.file}`}
                target="_blank"
                rel="noopener noreferrer" // Added rel attribute
                className="btn theme-btn-3 w-100 d-flex align-items-center text-highlight"
              >
                <i className="fa-solid fa-link me-2" />
                {element.title}
              </a>
            </div>
            <div className="col-md-4">
              <button
                type="button"
                className="p-2 rounded-1 theme-btn-3"
                onClick={() => handleFileDelete(element.id)}
              >
                <i className="fa-solid fa-trash d-flex"></i>
              </button>
            </div>
          </div>
        ))}

      <form onSubmit={handleSubmit}>
        {newDocuments &&
          newDocuments.map((element, index) => (
            <div className="row mb-50 align-items-center" key={index}>
              <div className="col-md-4">
                <div className="input-item">
                  <input
                    className="mb-0"
                    placeholder="Enter Document Title*"
                    type="text"
                    value={element.title}
                    onChange={(event) => handleTitleChange(index, event)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <input
                  type="file"
                  className="btn theme-btn-3 w-100"
                  onChange={(event) => handleFileChange(index, event)}
                  ref={file}
                />
              </div>
              {index === newDocuments.length - 1 && (
                <div className="col-md-2 d-flex">
                  <button
                    type="button"
                    className="p-2 rounded-1 theme-btn-3"
                    onClick={handleAddDocument}
                  >
                    <i className="fa-solid fa-square-plus d-flex "></i>
                  </button>
                </div>
              )}
            </div>
          ))}

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
    </div>
  );
}
