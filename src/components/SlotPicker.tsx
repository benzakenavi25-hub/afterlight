import type { KeyboardEvent } from 'react';
import { contact } from '../data/content';

const { slots } = contact;

export type Slot = { day: number | null; time: string | null };

/** The next 7 days, starting today (local time). */
export function nextDays(): Date[] {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i));
}

const weekday = new Intl.DateTimeFormat('he-IL', { weekday: 'long' });
const dayMonth = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long' });
const shortMonth = new Intl.DateTimeFormat('he-IL', { month: 'short' });

/** "יום חמישי, 27 בנובמבר" */
export const formatDay = (d: Date) => `${weekday.format(d)}, ${dayMonth.format(d)}`;

/** Arrow keys move focus within a button group (RTL: ← = next). Home / End jump to the ends. */
function onGroupKey(e: KeyboardEvent<HTMLDivElement>) {
  const btns = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('button')];
  const i = btns.indexOf(document.activeElement as HTMLButtonElement);
  if (i < 0) return;
  const next = { ArrowLeft: i + 1, ArrowRight: i - 1, Home: 0, End: btns.length - 1 }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  btns[Math.max(0, Math.min(btns.length - 1, next))].focus();
}

/** Demo slot picker: real buttons with aria-pressed; nothing leaves the page. */
export function SlotPicker({
  days,
  value,
  onChange,
  invalid,
}: {
  days: Date[];
  value: Slot;
  onChange: (s: Slot) => void;
  invalid: boolean;
}) {
  return (
    <div className="slots">
      <fieldset className="slots__group" aria-describedby={invalid ? 'f-slot-error' : undefined}>
        <legend className="slots__legend">{slots.dayLegend}</legend>
        <div className="slots__days" onKeyDown={onGroupKey}>
          {days.map((d, i) => (
            <button
              key={i}
              type="button"
              className="slots__day"
              aria-pressed={value.day === i}
              aria-label={formatDay(d)}
              onClick={() => onChange({ day: i, time: value.time })}
            >
              <span className="slots__wd">{weekday.format(d).replace('יום ', '')}</span>
              <span className="slots__num">{d.getDate()}</span>
              <span className="slots__mon">{shortMonth.format(d)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="slots__group" disabled={value.day === null}>
        <legend className="slots__legend">{slots.timeLegend}</legend>
        {value.day === null ? (
          <p className="slots__hint">{slots.pickDayFirst}</p>
        ) : (
          <div className="slots__times" onKeyDown={onGroupKey}>
            {slots.times.map((t) => (
              <button
                key={t.time}
                type="button"
                className="slots__time"
                aria-pressed={value.time === t.time}
                onClick={() => onChange({ day: value.day, time: t.time })}
              >
                <span className="latin-nums">{t.time}</span>
                {'note' in t && <span className="slots__note">{t.note}</span>}
              </button>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}
