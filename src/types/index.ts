export interface Event {
    id: string;
    title: string;
    date: Date;
  }
  
  export interface CalendarDay {
    date: Date;
    events: Event[];
    isCurrentMonth: boolean;
  }