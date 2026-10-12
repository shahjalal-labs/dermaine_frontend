/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Circle,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import TimezoneSelect from "react-timezone-select";

export default function Consultation() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2026, 4, 1)
  );
  const [month, setMonth] = useState<Date>(new Date(2026, 4, 1));
  const [selectedTime, setSelectedTime] = useState<string>("11:00 AM");
  const [selectedTimezone, setSelectedTimezone] = useState<any>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const handlePrevMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setMonth(newMonth);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-16  bg-background ">
      <h1 className="text-3xl md:text-[40px] font-bold caros  text-title mb-8 md:mb-12">
        Book Consultation
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6 md:gap-8 items-start">
        {/* Left Column - Calendar */}
        <div className="flex flex-col gap-4">
          {/* Top Banner */}
          <div className="bg-[#EDEEF1] rounded-xl py-4 md:py-5 text-center font-bold text-title caros  text-lg md:text-xl">
            {selectedDate
              ? format(selectedDate, "MMM , yyyy")
              : format(month, "MMM , yyyy")}
          </div>

          {/* Calendar Body */}
          <div className="bg-[#EDEEF1] rounded-2xl p-6 md:p-10 flex-1 border border-black/5">
            <style
              dangerouslySetInnerHTML={{
                __html: `
                            .rdp, .rdp-root {
                                margin: 0;
                                width: 100% !important;
                                max-width: none !important;
                                display: block !important;
                            }
                            .rdp-months { width: 100% !important; max-width: none !important; justify-content: center; display: flex !important; }
                            .rdp-month { width: 100% !important; max-width: none !important; }
                            .rdp-table, .rdp-month_grid { 
                                width: 100% !important; 
                                max-width: none !important; 
                                border-collapse: collapse !important; 
                                table-layout: fixed !important; 
                            }
                            .rdp-head_cell, .rdp-weekday {
                                font-family: var(--font-caros , serif);
                                font-size: 18px;
                                font-weight: 500;
                                padding-bottom: 24px;
                                color: #1E293B;
                                text-align: center;
                            }
                            .rdp-cell, .rdp-day_cell, .rdp-day {
                                padding: 0 0 16px 0;
                                text-align: center;
                                background: transparent !important;
                            }
                            .rdp-day_button, .rdp-day button, .rdp-button_reset {
                                width: 46px !important;
                                height: 46px !important;
                                min-width: 46px !important;
                                border-radius: 9999px !important;
                                font-family: var(--font-caros , serif) !important;
                                font-size: 18px !important;
                                font-weight: bold !important;
                                margin: 0 auto !important;
                                display: flex !important;
                                justify-content: center !important;
                                align-items: center !important;
                                outline: none !important;
                                border: none !important;
                                box-shadow: none !important;
                                background-color: transparent;
                                cursor: pointer ;
                                color: #1E293B;
                                transition: background-color 0.2s;
                            }
                            .rdp-day_button:hover, .rdp-day button:hover {
                                background-color: rgba(0,0,0,0.05);
                            }
                            .rdp-day_button:focus, .rdp-day_button:active, .rdp-day_button:focus-visible, .rdp-day button:focus {
                                outline: none !important;
                                border: none !important;
                                box-shadow: none !important;
                            }
                            .rdp-day_selected .rdp-day_button, .rdp-selected .rdp-day_button, .rdp-day_button.rdp-selected, .rdp-day_button.rdp-day_selected, .rdp-day button[aria-selected="true"] {
                                background-color: #00A63E !important; 
                                color: white !important;
                            }
                            .rdp-day_selected .rdp-day_button:hover, .rdp-selected .rdp-day_button:hover, .rdp-day_button.rdp-selected:hover, .rdp-day button[aria-selected="true"]:hover {
                                background-color: #009b46 !important;
                            }
                            .rdp-day_outside, .rdp-outside {
                                opacity: 0.25 !important;
                            }
                            .rdp-nav {
                                display: none !important; 
                            }
                            .rdp-caption, .rdp-month_caption {
                                display: none !important; 
                            }
                            @media (min-width: 768px) {
                                .rdp-day_button, .rdp-day button {
                                    width: 50px !important;
                                    height: 50px !important;
                                    min-width: 50px !important;
                                    font-size: 20px !important;
                                }
                                .rdp-head_cell, .rdp-weekday {
                                    font-size: 20px;
                                }
                            }
                        `,
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-10 relative z-20">
              <div className="relative flex items-center gap-2 cursor-pointer  text-title group">
                <select
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer  z-10"
                  value={month.getFullYear()}
                  onChange={(e) => {
                    const newMonth = new Date(month);
                    newMonth.setFullYear(parseInt(e.target.value));
                    setMonth(newMonth);
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => 2024 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="caros  font-medium text-lg md:text-xl group-hover:text-primary transition-colors ">
                  {format(month, "yyyy")}
                </span>
                <ChevronDown size={18} className="text-primary mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-md bg-[#1D4020] text-white flex items-center justify-center hover:bg-[#152319] transition-colors shadow-sm cursor-pointer "
                >
                  <ChevronRight size={18} className="rotate-180" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-md bg-[#1D4020] text-white flex items-center justify-center hover:bg-[#152319] transition-colors shadow-sm cursor-pointer "
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* React Day Picker */}
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              showOutsideDays
              month={month}
              onMonthChange={setMonth}
              formatters={{
                formatWeekdayName: (day) => format(day, "EEE"),
              }}
              classNames={{
                month_caption: "hidden",
                nav: "hidden",
                month_grid: "w-full border-collapse",
                weekdays: "w-full",
                weekday:
                  "text-base md:text-lg caros  font-medium text-title text-center pb-6 font-normal",
                week: "w-full mt-2",
              }}
            />
          </div>
        </div>

        {/* Right Column - Time Selection */}
        <div className="bg-[#EDEEF1] rounded-2xl p-6 md:p-10 flex flex-col h-full">
          <h3 className="text-xl md:text-[22px] caros  text-[#475569] font-bold mb-8">
            Select date and time
          </h3>

          {/* Morning */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10.5 h-10.5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sun size={20} strokeWidth={2} />
              </div>
              <div className="mt-0.5">
                <h4 className="font-bold text-base md:text-lg text-title mb-1.5">
                  Morning
                </h4>
                <p className="text-base text-primary font-bold tracking-wide uppercase">
                  9 AM - 12 PM
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                "9:00 AM",
                "9:30 AM",
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "12:00 PM",
              ].map((time) => {
                const isSelected = time === selectedTime;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                                        flex items-center justify-center gap-2 py-3 px-2 rounded-md border text-base md:text-lg font-medium transition-colors poppins 
                                        ${isSelected ? "bg-primary border-primary text-white shadow-sm" : "bg-transparent border-black/10 text-[#475569] hover:bg-black/5"}
                                    `}
                  >
                    {isSelected ? (
                      <ArrowRight size={14} strokeWidth={2.5} />
                    ) : (
                      <Circle
                        size={14}
                        className="text-primary opacity-70"
                        strokeWidth={2}
                      />
                    )}
                    <span className="whitespace-nowrap">{time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Evening */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10.5 h-10.5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                <Moon size={20} strokeWidth={2} />
              </div>
              <div className="mt-0.5">
                <h4 className="font-bold text-[17px] text-title mb-1.5">
                  Evening
                </h4>
                <p className="text-base text-primary font-bold tracking-wide uppercase">
                  3 PM - 6 PM
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                "3:00 PM",
                "3:30 PM",
                "4:00 PM",
                "4:30 PM",
                "5:00 PM",
                "6:00 PM",
              ].map((time) => {
                const isSelected = time === selectedTime;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                                        flex items-center justify-center gap-2 py-3 px-2 rounded-md border text-base md:text-lg font-medium transition-colors poppins 
                                        ${isSelected ? "bg-primary border-primary text-white shadow-sm" : "bg-transparent border-black/10 text-[#475569] hover:bg-black/5"}
                                    `}
                  >
                    {isSelected ? (
                      <ArrowRight size={14} strokeWidth={2.5} />
                    ) : (
                      <Circle
                        size={14}
                        className="text-primary opacity-70"
                        strokeWidth={2}
                      />
                    )}
                    <span className="whitespace-nowrap">{time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <h3 className="text-[22px] caros  text-[#475569] font-bold mb-4">
              Time zone
            </h3>
            <div className="relative mb-10 z-50">
              <TimezoneSelect
                value={selectedTimezone}
                onChange={setSelectedTimezone}
                className="w-full text-base md:text-lg text-black/60 font-medium poppins "
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: "0.2rem 0",
                    borderRadius: "0.375rem",
                    borderColor: "rgba(0,0,0,0.1)",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#00b050",
                    },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    color: state.isSelected ? "white" : "#475569",
                    backgroundColor: state.isSelected
                      ? "#00b050"
                      : state.isFocused
                        ? "rgba(0,176,80,0.1)"
                        : "transparent",
                    cursor: "pointer ",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "#475569",
                  }),
                }}
              />
            </div>

            <div className="flex justify-end">
              <button className="bg-primary hover:bg-primary/80 cursor-pointer  text-white font-medium py-3 px-10 rounded-md transition-colors text-base md:text-lg shadow-sm poppins ">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
