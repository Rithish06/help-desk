import { DatePipe } from '@angular/common';

export const formatTime = (utcDate: string): string => {
  const localDateStr = new Date(utcDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const parts = localDateStr.split(", ");
  
  if (parts.length < 2) return ''; // avoid crashing

  const timePart = parts[1]; // eg: "14:32:00"
  let [hour, min] = timePart.split(":");

  let hh = parseInt(hour, 10);
  let suffix = "AM";

  if (hh >= 12) {
    suffix = "PM";
    if (hh > 12) hh -= 12;
  } else if (hh === 0) {
    hh = 12;
  }

  return `${hh}:${min} ${suffix}`;
};


export const formatDate = (e: any) => {
  if (!e || typeof e !== 'string' || !e.includes('T')) {
    return ''; // or return a fallback like 'Invalid Date'
  }

  const datePart = e.split("T")[0];
  const [year, month, date] = datePart.split('-');
  return datePart;
};


export const convertUTCtoIST = (utcDate: string): string => {
    const date = new Date(utcDate);
    return date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });}

// `${date}-${month}${year}`

export const capitalizeFirstLetter = (sentence: string): string => {
  if (!sentence || sentence.length === 0) {
    return sentence;
  }
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export const sortTicketsByDate = (tickets: any[]): any[] => {
  return tickets.sort((a: any, b: any) => {
    const dateA = a.ticketCreatedTime ? new Date(a.ticketCreatedTime).getTime() : 0;
    const dateB = b.ticketCreatedTime ? new Date(b.ticketCreatedTime).getTime() : 0;
    return dateB - dateA;
  });
};