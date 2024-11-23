import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Event, CalendarDay } from "../types";
import EventModal from "./EventModal";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));

    return eachDayOfInterval({ start, end }).map((day) => ({
      date: day,
      events: events
        .filter(
          (event) =>
            format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        )
        .slice(0, 3),
      isCurrentMonth: isSameMonth(day, date),
    }));
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center font-medium py-2">
              {day}
            </div>
          ))}

          {days.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[100px] p-2 border rounded-lg ${
                day.isCurrentMonth ? "bg-white" : "bg-gray-50"
              }`}
              onClick={() => {
                setSelectedDate(day.date);
                setIsModalOpen(true);
              }}
            >
              <div className="text-right mb-2">{format(day.date, "d")}</div>
              <div className="space-y-1">
                {day.events.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 bg-blue-100 rounded truncate"
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setSelectedDate(new Date());
            setIsModalOpen(true);
          }}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Zametka qo'shish
        </button>
      </div>

      {isModalOpen && (
        <EventModal
          selectedDate={selectedDate || new Date()}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
