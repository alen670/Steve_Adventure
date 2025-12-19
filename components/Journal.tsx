import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { BookOpen, PenTool, Trash2, Calendar } from 'lucide-react';
import { DatePickerMC } from './DatePickerMC';

const INDEX_KEY = 'diary:index';
const entryKey = (date: string) => `diary:${date}`;

const todayISO = () => new Date().toISOString().slice(0, 10);

export const Journal: React.FC = () => {
  const [date, setDate] = useState<string>(todayISO());
  const [text, setText] = useState<string>('');
  const [savedDates, setSavedDates] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(INDEX_KEY);
    if (raw) {
      try {
        setSavedDates(JSON.parse(raw));
      } catch {
        setSavedDates([]);
      }
    }
  }, []);

  useEffect(() => {
    loadEntry(date);
  }, [date]);

  const loadEntry = (d: string) => {
    const val = localStorage.getItem(entryKey(d)) || '';
    setText(val);
  };

  const saveEntry = () => {
    localStorage.setItem(entryKey(date), text);

    const updated = Array.from(new Set([date, ...savedDates]));
    setSavedDates(updated);
    localStorage.setItem(INDEX_KEY, JSON.stringify(updated));
    alert('已保存：' + date);
  };

  const deleteEntry = () => {
    if (!confirm(`删除 ${date} 的日记？`)) return;
    localStorage.removeItem(entryKey(date));
    const updated = savedDates.filter(d => d !== date);
    setSavedDates(updated);
    localStorage.setItem(INDEX_KEY, JSON.stringify(updated));
    setText('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 transform transition-all duration-500 hover:scale-[1.02]">
      <div className="bg-[#c6b284]/95 backdrop-blur-sm border-[6px] border-[#5e4b35] p-2 relative shadow-2xl hover:shadow-3xl transition-shadow duration-300">
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#5e4b35] opacity-50"></div>

        <div className="bg-[#fcf3d1] p-6 md:p-8 min-h-[400px] flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-[#5e4b35]">
            <BookOpen size={24} />
            <h2 className="mc-font text-xl md:text-2xl">冒险日志（本地）</h2>
          </div>

          {/* Date Picker Section */}
          <div className="bg-[#e8d7c3] border-2 border-[#5e4b35] p-4 mb-4">
            <div className="flex gap-2 mb-3 items-center">
              <Calendar size={16} className="text-[#5e4b35]" />
              <label className="mc-font text-xs text-[#5e4b35]">选择日期</label>
            </div>
            <DatePickerMC value={date} onChange={setDate} />
          </div>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在这里写下你的冒险日志..."
            className="flex-grow w-full font-serif text-[#3e2b15] text-base leading-relaxed p-4 resize-none bg-white border-2 border-[#5e4b35] mb-4 focus:outline-none focus:ring-2 focus:ring-[#5e4b35] focus:ring-inset"
            style={{ minHeight: 220 }}
          />

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end mb-4">
            <Button onClick={saveEntry} className="flex items-center gap-2">
              <PenTool size={14} /> 保存
            </Button>
            <Button onClick={deleteEntry} variant="danger" className="flex items-center gap-2">
              <Trash2 size={14} /> 删除
            </Button>
          </div>

          {/* Saved Dates Section */}
          <div className="bg-[#e8d7c3] border-2 border-[#5e4b35] p-4">
            <h4 className="mc-font text-xs text-[#5e4b35] mb-3">已保存的日期</h4>
            {savedDates.length === 0 ? (
              <div className="text-xs text-[#5e4b35] italic">暂无已保存的日记</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {savedDates.map(d => (
                  <button
                    key={d}
                    onClick={() => setDate(d)}
                    className={`mc-font text-xs px-3 py-2 border-2 transition-all ${
                      date === d 
                        ? 'bg-[#5e4b35] text-white border-[#3e2b15]' 
                        : 'bg-white text-[#5e4b35] border-[#5e4b35] hover:bg-[#d4c4b0]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};