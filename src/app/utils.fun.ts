import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';


export const formatTime = (utcDate: string): string => {
  const date = new Date(utcDate);
  
  // Convert UTC to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istDate = new Date(date.getTime() + istOffset);
  
  // Extract components
  const dd = istDate.getDate().toString().padStart(2, '0');
  const mm = (istDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const yyyy = istDate.getFullYear();
  let hh = istDate.getHours();
  const min = istDate.getMinutes().toString().padStart(2, '0');
  let suffix = "AM";

  if (hh >= 12) {
    suffix = "PM";
    if (hh > 12) hh -= 12;
  }
  if (hh === 0) hh = 12; // Midnight case

  // Return formatted string: DD-MM-YYYY HH:MM AM/PM
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
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true  // 12-hour format with AM/PM
  };
  
  return new Date(utcDate).toLocaleTimeString('en-US', options);
};

// Example usage:
console.log(convertUTCtoIST("2025-04-16T19:27:41.438+00:00")); 
// Output: "12:57 AM" (UTC 19:27 = IST 00:57 next day)


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

@Pipe({ name: 'capitalizeFirst' })
export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}