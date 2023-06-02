import jwt from 'jsonwebtoken';
import moment from "moment";
import 'moment-timezone';

export const checkTimeOver = (date, time) => {
    const difdate = date;
    const parts = difdate.split("-");
    const fpdate = parts[0]+'-'+parts[1]+'-'+parts[2];

    const givenDate = new Date(fpdate+'T'+time);
    const currentDate = new Date();

    givenDate.setSeconds(0);
    givenDate.setMilliseconds(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    return givenDate < currentDate;
}

export const findCurrentTimeSlot = (timeslots) => {
    const currentTime = currentTimezoneBasedTime().split(":");
    const currentHours = parseInt(currentTime[0]);
    const currentMinutes = parseInt(currentTime[1]);
    const currentTimeInMinutes = (currentHours * 60) + currentMinutes;

    for (let slot of timeslots) {
      const [fromHours, fromMinutes] = slot.fromTime.split(':');
      const [toHours, toMinutes] = slot.toTime.split(':');

      const fromTimeInMinutes = parseInt(fromHours) * 60 + parseInt(fromMinutes);
      const toTimeInMinutes = parseInt(toHours) * 60 + parseInt(toMinutes);

      if (currentTimeInMinutes >= fromTimeInMinutes && currentTimeInMinutes < toTimeInMinutes) {
        return slot;
      }
    }

  return null;
}

export const getUserDetailsFromJwt = (token) => {
  try {
    let tokenToDecode = token;
    if (!tokenToDecode) {
      tokenToDecode = getLoginToken();
    }
    
    const decoded = jwt.verify(tokenToDecode, process.env.REACT_APP_JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('Token has expired:', err.message);
    } else {
      console.log('Error decoding token:', err.message);
    }
    return "";
  }
}

export const convertTimestampToDateTime = (timestamp, format) => {
  return timestamp ? moment.unix(timestamp / 1000).format(format ? format : "HH:mm") : "-";
}

export const setMomentDefaultTimezone = () => {
  moment.tz.setDefault(getUserTimezone());
}

export const getMomentDefaultTimezone = () => {
  return moment().tz();
}

export const formatSlotFromTime = (fromTime, sourceFormat, targetFromat) => {
  return fromTime ? moment(fromTime, (sourceFormat ? sourceFormat : "hh:mm:ss")).format(targetFromat ? targetFromat : "HH:mm") : "-";
}

export const formatCreatedAtTimestamp = (createdAt, format) => {
  return createdAt ? moment.utc(createdAt).format(format ? format : "D/MM/YYYY") : "-";
}

export const formatAppointmentDate = (appointmentDate, format) => {
  return appointmentDate ? moment(appointmentDate).format(format ? format : "D/MM/YYYY") : "-";
}

export const addTimeInTimestamp = (timestamp, time, type) => {
  return timestamp ? (moment.unix(timestamp / 1000).add(time ? time : 0, type ? type : 'minutes').unix() * 1000) : "-";
}

export const convertTimeToTimezoneBasedTime = (time) => {
  return time ? moment.tz(time, "HH:mm", getUserTimezone()).format("HH:mm") : "-";
}

export const currentTimezoneBasedDate = () => {
  return moment(new Date()).format("YYYY-MM-DD");
}

export const currentTimezoneBasedTime = () => {
  return moment(new Date()).format("HH:mm");
}

export const convertGmtToTime = (time, format) => {
  return time ? moment.tz(time, "HH:mm:ss", "GMT").tz(getUserTimezone()).format(format ? format : "HH:mm") : "-";
}

export const getLoginToken = () => {
  return JSON.parse(localStorage.getItem("userToken"));
}

export const removeLoginToken = () => {
  return localStorage.removeItem("userToken");
}

export const setLoginToken = (token) => {
  localStorage.setItem("userToken", JSON.stringify(token));
}

export const getUserTimezone = () => {
  return JSON.parse(localStorage.getItem("userTimezone"));
}

export const setUserTimezone = (timezone) => {
  localStorage.setItem("userTimezone", JSON.stringify(timezone));
}

export const setResponseHandler = (responseMessage, isSuccess = false) => {
  let response = { errors: responseMessage, success: "" };

  if (isSuccess) {
    response.errors = [];
    response.success = responseMessage;
  }

  return response;
}