import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface FormDatePickerProps {
  name: string;
  label: React.ReactNode;
  containerClassName?: string;
  error?: string;
  placeholder?: string;
}

export default function FormDatePicker({
  name,
  label,
  containerClassName,
  error,
  placeholder,
}: FormDatePickerProps) {
  const { control } = useFormContext();
  const {
    field: { onChange, onBlur, value },
    fieldState: { error: rhfError },
  } = useController({ name, control });

  const fieldError = error || rhfError?.message;
  
  const parsedDate = value ? new Date(value + "T12:00:00") : undefined;

  const [isOpen, setIsOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(parsedDate || new Date());
  const lastMonthChangeTime = React.useRef(0);

  // Sync visible month if value changes externally
  React.useEffect(() => {
    if (parsedDate) {
      setMonth(parsedDate);
    } 
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    // Ignore tap bleed-through on iOS (if month was changed < 500ms ago)
    if (Date.now() - lastMonthChangeTime.current < 500) return;

    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      onChange(formatted);
      onBlur();
      setIsOpen(false);
    } else {
      onChange(undefined);
      onBlur();
    }
  };

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
    lastMonthChangeTime.current = Date.now();
  };

  const handleReset = () => {
    const today = new Date();
    const formatted = format(today, "yyyy-MM-dd");
    onChange(formatted);
    setMonth(new Date(formatted + "T12:00:00"));
    onBlur();
    setIsOpen(false);
  };

  return (
    <div className={containerClassName}>
      <label className="block mb-2 text-base md:text-xl font-medium text-gray-900">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal border rounded-lg px-4 py-3 h-auto appearance-none text-base md:text-lg transition-all duration-200 !bg-white hover:!bg-white aria-expanded:!bg-white hover:!scale-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500",
              !value && "text-muted-foreground",
              fieldError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400 pointer-events-none" />
            <span className="pointer-events-none">{value ? format(new Date(value + "T12:00:00"), "PPP") : (placeholder || "Pick a date")}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
          <Calendar
            mode="single"
            selected={parsedDate}
            onSelect={handleSelect}
            month={month}
            onMonthChange={handleMonthChange}
            captionLayout="dropdown"
            startMonth={new Date(1900, 0)}
            endMonth={new Date(2100, 11)}
          />
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              className="w-full font-medium hover:!scale-100 hover:!bg-transparent"
              onClick={handleReset}
            >
              Reset to Current Date
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {fieldError && <p className="mt-1 text-sm text-red-500">{fieldError}</p>}
    </div>
  );
}
