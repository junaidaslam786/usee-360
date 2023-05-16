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

    // console.log('givenDate', givenDate.toString());
    // console.log('currentDate', currentDate.toString());
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

export const getUserDetailsFromJwt = () => {
  try {
    const customerToken = JSON.parse(localStorage.getItem("customerToken"));
    const agentToken = JSON.parse(localStorage.getItem("agentToken"));
    const decoded = jwt.verify(agentToken || customerToken, process.env.REACT_APP_JWT_SECRET_KEY);
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
  // console.log('convertTimestampToDateTime-timezone', getMomentDefaultTimezone());
  return timestamp ? moment.unix(timestamp / 1000).format(format ? format : "HH:mm") : "-";
}

export const setMomentDefaultTimezone = () => {
  moment.tz.setDefault(JSON.parse(localStorage.getItem("userTimezone")));
}

export const getMomentDefaultTimezone = () => {
  return moment().tz();
}

export const formatSlotFromTime = (fromTime, sourceFormat, targetFromat) => {
  // console.log('formatSlotFromTime-timezone', getMomentDefaultTimezone());
  return fromTime ? moment(fromTime, (sourceFormat ? sourceFormat : "hh:mm:ss")).format(targetFromat ? targetFromat : "HH:mm") : "-";
}

export const formatCreatedAtTimestamp = (createdAt, format) => {
  // console.log('formatCreatedAtTimestamp-timezone', getMomentDefaultTimezone());
  return createdAt ? moment.utc(createdAt).format(format ? format : "D/MM/YYYY") : "-";
}

export const formatAppointmentDate = (appointmentDate, format) => {
  // console.log('formatAppointmentDate-timezone', getMomentDefaultTimezone());
  return appointmentDate ? moment(appointmentDate).format(format ? format : "D/MM/YYYY") : "-";
}

export const addTimeInTimestamp = (timestamp, time, type) => {
  // console.log('addTimeInTimestamp-timezone', getMomentDefaultTimezone());
  return timestamp ? (moment.unix(timestamp / 1000).add(time ? time : 0, type ? type : 'minutes').unix() * 1000) : "-";
}

export const convertTimeToTimezoneBasedTime = (time) => {
  // console.log('convertTimeToTimezoneBasedTime-timezone', getMomentDefaultTimezone());
  return time ? moment.tz(time, "HH:mm", JSON.parse(localStorage.getItem("userTimezone"))).format("HH:mm") : "-";
}

export const currentTimezoneBasedDate = () => {
  // console.log('currentTimezoneBasedDate-timezone', getMomentDefaultTimezone());
  return moment(new Date()).format("YYYY-MM-DD");
}

export const currentTimezoneBasedTime = () => {
  // console.log('currentTimezoneBasedDate-timezone', getMomentDefaultTimezone());
  return moment(new Date()).format("HH:mm");
}

export const convertGmtToTime = (time, format) => {
  return time ? moment.tz(time, "HH:mm:ss", "GMT").tz(JSON.parse(localStorage.getItem("userTimezone"))).format(format ? format : "HH:mm") : "-";
}