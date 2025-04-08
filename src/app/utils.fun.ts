import { DatePipe } from '@angular/common';

export const formaTime = (utcDate: any) => {
    const date = new Date(utcDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const [fullDate, time] = date.split(", ");
    let [hour, min, sec] = time.split(":");
  
    let suffix = "AM";
    let hh = parseInt(hour);
  
    if (hh >= 12) {
      suffix = "PM";
      if (hh > 12) hh -= 12; // Convert to 12-hour format
    } else if (hh === 0) {
        hh = 12; // Midnight case
    }
  
    return `${hh}:${min} ${suffix}`;
  };

export const formatDate = (e:any) => {
    const Date = e.split("T")[0]
    const [year, month, date] = Date.split('-')
    return  Date
}

export const convertUTCtoIST = (utcDate: string): string => {
    const date = new Date(utcDate);
    return date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  }

// `${date}-${month}${year}`