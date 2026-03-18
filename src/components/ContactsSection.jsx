import React from 'react';
import { Smartphone } from 'lucide-react';

export default function ContactsSection({
  contacts,
  errors,
  touched,
  onAdd,
  onRemove,
  onUpdate,
}) {
  return (
    <section className="form-section">
      <div className="section-header">
        <Smartphone />
        <h2>Contacts</h2>
      </div>

      <p className="section-hint">
        Add your gallery's social media and contact channels.
      </p>

      {touched.contacts && errors.contacts && (
        <p className="error-message">{errors.contacts}</p>
      )}

      <div className="contacts-list">
        {contacts.map((contact, index) => {
          const rowErr = errors.contactRows?.[index];
          return (
            <div className="contact-row" key={index}>
              <div className="contact-fields">
                <div className="field-group contact-field">
                  <input
                    type="text"
                    className={`field-input ${rowErr?.platform ? 'field-error' : ''}`}
                    placeholder="Platform (e.g. Instagram)"
                    value={contact.platform}
                    onChange={(e) => onUpdate(index, 'platform', e.target.value)}
                  />
                  {rowErr?.platform && (
                    <p className="error-message">{rowErr.platform}</p>
                  )}
                </div>
                <div className="field-group contact-field">
                  <input
                    type="text"
                    className={`field-input ${rowErr?.value ? 'field-error' : ''}`}
                    placeholder="Handle / URL (e.g. @galleryname)"
                    value={contact.value}
                    onChange={(e) => onUpdate(index, 'value', e.target.value)}
                  />
                  {rowErr?.value && (
                    <p className="error-message">{rowErr.value}</p>
                  )}
                </div>
              </div>
              {contacts.length > 1 && (
                <button
                  type="button"
                  className="btn-icon btn-remove"
                  onClick={() => onRemove(index)}
                  title="Remove contact"
                  aria-label={`Remove contact ${index + 1}`}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="btn-secondary btn-add-contact" onClick={onAdd}>
        <span>+</span> Add Contact
      </button>
    </section>
  );
}
