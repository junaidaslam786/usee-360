import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "react-dropzone";
import ProfileService from "../../../services/profile";

export default function UploadCallBackgroundImage(props) {
    const [callBackgroundImages, setCallBackgroundImages] = useState([]);

    const onImagesDrop = useCallback(async (acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("userId", props.id);

        const formResponse = await ProfileService.uploadCallBackgroundImage(formData);

        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        props.responseHandler("Background call images uploaded successfully", true);
        setCallBackgroundImages(formResponse);
    }, []);
    
    const handleFileDelete = async (fileId) => {
        const formResponse = await ProfileService.deleteCallBackgroundImage({
            "userId": props.id,
            "imageId": fileId
        });
            
        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        const currentImages = [...callBackgroundImages];
        const deletedFileIndex = currentImages.findIndex((image) => image.id === fileId);
        currentImages.splice(deletedFileIndex, 1);

        setCallBackgroundImages(currentImages);
        props.responseHandler(formResponse.message, true);
    }

    useEffect(() => {
        if (props?.images) {
            setCallBackgroundImages(props.images);
        }
    }, [props.images]);

    return (
        <React.Fragment>
            <h4 className="title-2 mt-100">Call Background Images</h4>
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
            <div className="row">
                {
                    callBackgroundImages && callBackgroundImages.map((file, index) => ( 
                        <div className="col-md-4" key={file.id}>
                            <div><img width="150px" height="130px" src={ `${process.env.REACT_APP_API_URL}/${file.url}` }></img></div>
                            <button type="button" onClick={ () => handleFileDelete(file.id) }>Remove File</button>
                        </div>
                    ))
                }
            </div>
        </React.Fragment>
    );
}