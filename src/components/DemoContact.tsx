import { useMemo, useRef, useState, type FormEvent } from 'react';
import { b2b, contact, studio } from '../data/content';
import { SlotPicker, formatDay, nextDays, type Slot } from './SlotPicker';
import './DemoContact.css';

type FieldName = 'name' | 'reach' | 'slot';
type Errors = Partial<Record<FieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: HTMLFormElement, slot: Slot): Errors {
  const data = new FormData(form);
  const name = String(data.get('name') ?? '').trim();
  const reach = String(data.get('reach') ?? '').trim();
  const digits = reach.replace(/\D/g, '');
  const errors: Errors = {};
  if (slot.day === null || slot.time === null) errors.slot = contact.errors.slot;
  if (name.length < 2) errors.name = contact.errors.name;
  if (!reach) errors.reach = contact.errors.reachEmpty;
  else if (!EMAIL.test(reach) && !(digits.length >= 9 && /^[\d\s()+-]+$/.test(reach)))
    errors.reach = contact.errors.reachInvalid;
  return errors;
}

/**
 * Demo inquiry form. Handled locally only: nothing is sent, stored or logged.
 * Values are read once for validation and never kept in state.
 */
export function DemoContact() {
  const days = useMemo(nextDays, []);
  const [slot, setSlot] = useState<Slot>({ day: null, time: null });
  /** Confirmed slot (demo): the confirmation card replaces the form. */
  const [booked, setBooked] = useState<{ day: Date; time: string } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const next = validate(form, slot);
    setErrors(next);
    const first = (['slot', 'name', 'reach'] as FieldName[]).find((k) => next[k]);
    if (first) {
      const target =
        first === 'slot'
          ? form.querySelector<HTMLElement>('.slots__day')
          : form.querySelector<HTMLElement>(`[name="${first}"]`);
      target?.focus();
      return;
    }
    setBooked({ day: days[slot.day!], time: slot.time! });
    requestAnimationFrame(() => cardRef.current?.focus());
  };

  const again = () => {
    setBooked(null);
    setSlot({ day: null, time: null });
    setErrors({});
    requestAnimationFrame(() => wrapRef.current?.querySelector<HTMLElement>('.slots__day')?.focus());
  };

  const onSlot = (s: Slot) => {
    setSlot(s);
    if (errors.slot && s.day !== null && s.time !== null) setErrors(({ slot: _removed, ...rest }) => rest);
  };

  // Clear a field's error as soon as it is edited.
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as FieldName;
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest);
  };

  const fieldA11y = (name: FieldName) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `f-${name}-error` : undefined,
  });

  const errorText = (name: FieldName) =>
    errors[name] ? (
      <p id={`f-${name}-error`} className="field__error">
        {errors[name]}
      </p>
    ) : null;

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__intro">
          <h2 id="contact-title" className="ruled">{contact.heading}</h2>
          <p className="contact__notice">{contact.notice}</p>
        </div>

        {/* #visit stays on the wrapper so links and the phone bar find it in both states */}
        <div ref={wrapRef} id="visit" className="contact__visit">
        {booked ? (
          <div ref={cardRef} className="visit-card" tabIndex={-1} role="status">
            <p className="visit-card__title">{contact.confirm.title}</p>
            <p className="visit-card__when">
              {formatDay(booked.day)} · <span className="latin-nums">{booked.time}</span>
            </p>
            <p className="visit-card__demo">{contact.success}</p>
            <button type="button" className="btn btn--light visit-card__again" onClick={again}>
              {contact.confirm.again}
            </button>
          </div>
        ) : (
        <form
          ref={formRef}
          className="contact__form"
          onSubmit={onSubmit}
          onInput={onInput}
          noValidate
          aria-labelledby="contact-title"
        >
          <SlotPicker days={days} value={slot} onChange={onSlot} invalid={!!errors.slot} />
          {errorText('slot')}
          <div className="field">
            <label htmlFor="f-name">{contact.fields.name}</label>
            <input id="f-name" name="name" type="text" autoComplete="name" required {...fieldA11y('name')} />
            {errorText('name')}
          </div>
          <div className="field">
            <label htmlFor="f-reach">{contact.fields.reach}</label>
            <input
              id="f-reach"
              name="reach"
              type="text"
              autoComplete="email"
              dir="auto"
              required
              {...fieldA11y('reach')}
            />
            {errorText('reach')}
          </div>
          <div className="field">
            <label htmlFor="f-message">
              {contact.fields.message} <span className="field__optional">({contact.fields.optional})</span>
            </label>
            <textarea id="f-message" name="message" rows={4} />
          </div>
          <button className="btn btn--primary contact__submit" type="submit">
            {contact.submit}
          </button>
        </form>
        )}
        </div>

        <aside className="studio" aria-labelledby="studio-title">
          <h2 id="studio-title" className="studio__title ruled">
            {b2b.heading}
          </h2>
          <p className="studio__text">{b2b.text}</p>
          <div className="studio__actions">
            <a className="btn btn--primary studio__btn" href={studio.whatsapp} target="_blank" rel="noopener">
              <svg className="studio__wa" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
                />
              </svg>
              {b2b.whatsapp}
              <span className="visually-hidden"> {b2b.newTab}</span>
            </a>
            <a className="btn btn--light studio__btn" href={studio.contactHref} target="_blank" rel="noopener">
              {b2b.site}
              <span className="visually-hidden"> {b2b.newTab}</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
