import React, { useState, useCallback, useEffect } from "react";
import Dropzone from "react-dropzone";
import PropertyService from "../../../services/agent/property";

export default function UploadPropertyImage(props) {
    const [propertyImages, setPropertyImages] = useState([]);

    const onImagesDrop = useCallback(async (acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("productId", props.id);

        const formResponse = await PropertyService.uploadImage(formData);

        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        props.responseHandler("Images uploaded successfully", true);
        setPropertyImages(formResponse);
    }, []);
    
    const handleFileDelete = async (fileId) => {
        const formResponse = await PropertyService.deleteImage({
            "productId": props.id,
            "imageId": fileId
        });
            
        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        const currentImages = [...propertyImages];
        const deletedFileIndex = currentImages.findIndex((image) => image.id === fileId);
        currentImages.splice(deletedFileIndex, 1);

        setPropertyImages(currentImages);
        props.responseHandler(formResponse.message, true);
    }

    useEffect(() => {
        if (props?.images) {
            setPropertyImages(props.images);
        }
    }, [props.images]);

    return (
        <React.Fragment>
            <h4 className="title-2">Add More Images</h4>
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
        </React.Fragment>
    );
}