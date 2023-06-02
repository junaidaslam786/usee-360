import React, { useState } from "react";
import Select from "react-select";
import {
  PRODUCT_CATEGORIES,
  PROPERTY_TYPES,
  PROPERTY_CATEGORY_TYPES
} from "../../constants";

export default function CmsFilter(props) {
    const [category, setCategory] = useState();
    const [propertyType, setPropertyType] = useState();
    const [propertyCategoryType, setPropertyCategoryType] = useState();
    const [keyword, setKeyword] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        props.setFilters({
            category: (category?.value ? category.value : ""),
            propertyType: (propertyType?.value ? propertyType.value : ""),
            propertyCategoryType: (propertyCategoryType?.value ? propertyCategoryType.value : ""),
            keyword
        });
    }
    
    return (
        <div className="ltn__car-dealer-form-area mt-120 mb-120">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ltn__car-dealer-form-tab">
                            <div className="tab-content bg-white box-shadow-1 position-relative pb-10">
                                <div
                                    className="tab-pane fade active show"
                                    id="ltn__form_tab_1_1"
                                >
                                    <div className="car-dealer-form-inner">
                                        <form
                                            className="ltn__car-dealer-form-box row"
                                            onSubmit={handleSubmit}
                                        >
                                            <div className="input-item col-lg-3 col-md-6">
                                                <label>Category</label>
                                                <div className="input-item">
                                                    <Select
                                                        classNamePrefix="custom-select"
                                                        options={PRODUCT_CATEGORIES}
                                                        onChange={(e) => setCategory(e)}
                                                        value={category}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-item col-lg-3 col-md-6">
                                                <label>Property Type</label>
                                                <div className="input-item">
                                                    <Select
                                                        classNamePrefix="custom-select"
                                                        options={PROPERTY_TYPES}
                                                        onChange={(e) => setPropertyType(e)}
                                                        value={propertyType}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-item col-lg-3 col-md-6">
                                                <label>Property Category Type</label>
                                                <div className="input-item">
                                                    <Select
                                                        classNamePrefix="custom-select"
                                                        options={PROPERTY_CATEGORY_TYPES}
                                                        onChange={(e) => setPropertyCategoryType(e)}
                                                        value={propertyCategoryType}
                                                    />
                                                </div>
                                            </div>
                                            <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
                                                <label>Keyword</label>
                                                <input
                                                type="text"
                                                placeholder="Search..."
                                                onChange={(e) => setKeyword(e.target.value)}
                                                className="m-0"
                                                />
                                            </div>
                                            <div className="ltn__car-dealer-form-item ltn__custom-icon ltn__icon-calendar col-lg-3 col-md-6">
                                                <div className="btn-wrapper mt-0 go-top pt-1">
                                                    <button
                                                        className="btn theme-btn-1 btn-effect-1 text-uppercase search-btn"
                                                        type="submit"
                                                    >
                                                        Find Now
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};