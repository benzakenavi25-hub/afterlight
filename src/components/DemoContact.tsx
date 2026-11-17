import { useRef, useState, type FormEvent } from 'react';
import { b2b, contact, studio } from '../data/content';
import './DemoContact.css';

type FieldName = 'name' | 'reach';
type Errors = Partial<Record<FieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: HTMLFormElement): Errors {
  const data = new FormData(form);
  const name = String(data.get('name') ?? '').trim();
  const reach = String(data.get('reach') ?? '').trim();
  const digits = reach.replace(/\D/g, '');
  const errors: Errors = {};
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
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const next = validate(form);
    setErrors(next);
    const first = (Object.keys(next) as FieldName[])[0];
    if (first) {
      setDone(false);
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    form.reset();
    setDone(true);
  };

  // Clear a field's error as soon as it is edited; hide the demo confirmation on new input.
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as FieldName;
    setDone(false);
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
          <h2 id="contact-title">{contact.heading}</h2>
          <p className="contact__notice">{contact.notice}</p>
        </div>

        <form
          ref={formRef}
          id="visit"
          className="contact__form"
          onSubmit={onSubmit}
          onInput={onInput}
          noValidate
          aria-labelledby="contact-title"
        >
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
          <p className="contact__status" role="status">
            {done ? contact.success : ''}
          </p>
        </form>

        <aside className="studio" aria-labelledby="studio-title">
          <h2 id="studio-title" className="studio__title">
            {b2b.heading}
          </h2>
          <p className="studio__text">{b2b.text}</p>
          {studio.contactHref && (
            <a className="btn btn--light" href={studio.contactHref}>
              {b2b.cta}
            </a>
          )}
        </aside>
      </div>
    </section>
  );
}
