export const checkTimeOver = (dateTime, timeValue) => {
    let difdate = dateTime;
    let parts = difdate.split("-");
    let fpdate = parts[1]+'-'+parts[2]+'-'+parts[0];

    let startDate = new Date(fpdate+' '+timeValue);
    let today = new Date();

    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    
    return startDate < today;
}