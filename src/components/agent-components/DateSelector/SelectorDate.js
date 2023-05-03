import React, { useState } from "react";
import Cards from "../Cards";
import "../DateSelector/SelectorDate.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "react-modern-calendar-datepicker";

const SelectorDate = () => {
    const [selectedDay1, setSelectedDay1] = useState(null);
    const [selectedDay2, setSelectedDay2] = useState(null);

    return (
        <>
            <div className="date-Selector">
                <div class="position-relative clearfix">
                    <div class="dash_date_pickr" onclick="show();">
                        <div class="dash_date_icon"></div>
                        <i class="fa-solid fa-clock"></i>
                        <span class="ms-1">Any Date</span>
                        <div class="dash_date_arrow"></div>
                    </div>
                    <div class="dash_date_inner">
                        <div class="clearfix" style={{ height: "70px" }}>
                            <div class="dash_date_from">
                                <label>From</label>
                                <div class="dash_input">
                                    <span class="date_icon2"></span>
                                    <DatePicker
                                        value={selectedDay1}
                                        onChange={setSelectedDay1}
                                        // renderInput={renderCustomInput} // render a custom input
                                        shouldHighlightWeekends
                                    />
                                </div>
                            </div>

                            <div class="dash_date_to">
                                <label>To</label>
                                <div class="dash_input">
                                    <span class="date_icon2"></span>
                                    <DatePicker
                                        value={selectedDay2}
                                        onChange={setSelectedDay2}
                                        // renderInput={renderCustomInput} // render a custom input
                                        shouldHighlightWeekends
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="date_btns">
                            <button id="today_btn" type="button" class="date_btn" OnClick="searchcount('1');">
                                {" "}
                                Today{" "}
                            </button>
                            <button id="yesterday_btn" type="button" class="date_btn" OnClick="searchcount('2');">
                                {" "}
                                Yesterday{" "}
                            </button>
                            <button id="this_month_btn" type="button" class="date_btn" onclick="searchcount(3);">
                                {" "}
                                This Month{" "}
                            </button>
                            <button id="past_month_btn" type="button" class="date_btn" onclick="searchcount(4);">
                                {" "}
                                Past Month{" "}
                            </button>
                            <button id="three_months_btn" type="button" class="date_btn" onclick="searchcount(5);">
                                {" "}
                                Past 3 Months{" "}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Cards />
        </>
    );
};

export default SelectorDate;
