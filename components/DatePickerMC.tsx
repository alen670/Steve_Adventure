import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerMCProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
}

export const DatePickerMC: React.FC<DatePickerMCProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse date from YYYY-MM-DD string to avoid timezone issues
  const parseDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  
  const [currentDate, setCurrentDate] = useState(value ? parseDate(value) : new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getFirstDayOfMonth = () => new Date(year, month, 1).getDay();
  const getDaysInMonth = () => new Date(year, month + 1, 0).getDate();
  const getPrevMonthDays = () => new Date(year, month, 0).getDate();

  const firstDay = getFirstDayOfMonth();
  const daysInMonth = getDaysInMonth();
  const daysInPrevMonth = getPrevMonthDays();

  const calendarDays: (number | null)[] = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push(null);
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Next month days
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push(null);
  }

  const handleSelectDate = (day: number) => {
    const newDate = new Date(year, month, day);
    const y = newDate.getFullYear();
    const m = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const displayDate = value || new Date().toISOString().slice(0, 10);
  
  // Parse selected date to avoid timezone issues
  const selectedDate = value ? parseDate(value) : null;
  const selectedDay = selectedDate ? selectedDate.getDate() : null;
  const isCurrentMonth = selectedDate 
    ? selectedDate.getMonth() === month && selectedDate.getFullYear() === year
    : false;

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="relative w-full">
      {/* Input Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white text-[#3e2b15] p-3 border-b-4 border-r-4 border-[#5e4b35] border-t-2 border-l-2 border-[#8b7355] mc-font text-left flex justify-between items-center transition-all hover:shadow-md"
        style={{
          boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)',
          fontSize: '12px',
          letterSpacing: '0.05em'
        }}
      >
        <span>{displayDate}</span>
        <span className="text-[#5e4b35]">📅</span>
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[#c6b284] border-4 border-[#5e4b35] p-4 z-50 shadow-2xl w-full max-w-[90vw] md:max-w-md">
          {/* Month/Year Header */}
          <div className="bg-[#e8d7c3] border-2 border-[#5e4b35] p-3 mb-3">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevMonth}
                className="text-[#5e4b35] hover:text-[#3e2b15] transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="mc-font text-xs text-[#5e4b35] whitespace-nowrap">
                {year}年{monthNames[month]}
              </span>
              <button
                onClick={handleNextMonth}
                className="text-[#5e4b35] hover:text-[#3e2b15] transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2 bg-[#d4c4b0] p-2">
            {dayNames.map(day => (
              <div key={day} className="text-center mc-font text-xs text-[#5e4b35] font-bold">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 bg-white border-2 border-[#5e4b35] p-2">
            {calendarDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => day && handleSelectDate(day)}
                disabled={day === null}
                className={`
                  mc-font text-[10px] md:text-xs h-7 md:h-8 border-2 transition-all
                  ${day === null
                    ? 'bg-[#f5f5f5] border-[#cccccc] cursor-default'
                    : isCurrentMonth && day === selectedDay
                    ? 'bg-[#5e4b35] text-white border-[#3e2b15] font-bold'
                    : day && (new Date(year, month, day).getDate() === new Date().getDate() && new Date(year, month, day).getMonth() === new Date().getMonth() && new Date(year, month, day).getFullYear() === new Date().getFullYear())
                    ? 'bg-[#ffd700] text-[#3e2b15] border-[#daa520] font-bold'
                    : day
                    ? 'bg-[#fcf3d1] text-[#5e4b35] border-[#d4c4b0] hover:bg-[#e8d7c3] cursor-pointer'
                    : ''
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 justify-center">
            <button
              onClick={() => {
                const today = new Date();
                const y = today.getFullYear();
                const m = String(today.getMonth() + 1).padStart(2, '0');
                const d = String(today.getDate()).padStart(2, '0');
                const todayStr = `${y}-${m}-${d}`;
                onChange(todayStr);
                setIsOpen(false);
              }}
              className="mc-font text-xs px-3 py-2 bg-[#5e4b35] text-white border-2 border-[#3e2b15] hover:bg-[#3e2b15] transition-colors"
            >
              今天
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="mc-font text-xs px-3 py-2 bg-[#e8d7c3] text-[#5e4b35] border-2 border-[#5e4b35] hover:bg-[#d4c4b0] transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close calendar when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
