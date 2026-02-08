'use client';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
}

export default function DatePicker({ value, onChange, minDate }: DatePickerProps) {
  return (
    <div className="relative w-full">
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        minDate={minDate || new Date()}
        dateFormat="MMM dd, yyyy"
        placeholderText="Select due date"
        isClearable
        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-input bg-card text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        wrapperClassName="w-full"
        showPopperArrow={false}
        popperClassName="!z-[100]"
        popperPlacement="bottom-start"
      />
      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}