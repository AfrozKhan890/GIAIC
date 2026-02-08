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
    <div className="relative">
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        minDate={minDate || new Date()}
        dateFormat="MMM dd, yyyy"
        placeholderText="Select due date"
        isClearable
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-[#333333] focus:border-[#0077FF] focus:ring-2 focus:ring-[#0077FF]/20 transition-all"
        wrapperClassName="w-full"
      />
      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    </div>
  );
}