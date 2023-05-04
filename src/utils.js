import jwt from 'jsonwebtoken';

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
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

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