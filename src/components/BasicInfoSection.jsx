import React from 'react';
import { Landmark } from 'lucide-react';

export default function BasicInfoSection({ values, errors, touched, onChange }) {
  return (
    <section className="form-section">
      <div className="section-header">
        <Landmark />
        <h2>Basic Information</h2>
      </div>

      <div className="field-group">
        <label htmlFor="gallery-name" className="field-label">
          Gallery Name <span className="required">*</span>
        </label>
        <input
          id="gallery-name"
          type="text"
          className={`field-input ${touched.name && errors.name ? 'field-error' : ''}`}
          placeholder="e.g. Aurora Fine Arts Gallery"
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
        {touched.name && errors.name && (
          <p className="error-message">{errors.name}</p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="gallery-description" className="field-label">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="gallery-description"
          className={`field-input field-textarea ${touched.description && errors.description ? 'field-error' : ''}`}
          placeholder="Describe your gallery — its mission, focus areas, and what makes it unique…"
          rows={4}
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
        {touched.description && errors.description && (
          <p className="error-message">{errors.description}</p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="gallery-email" className="field-label">
          Email <span className="required">*</span>
        </label>
        <input
          id="gallery-email"
          type="email"
          className={`field-input ${touched.email && errors.email ? 'field-error' : ''}`}
          placeholder="gallery@example.com"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        {touched.email && errors.email && (
          <p className="error-message">{errors.email}</p>
        )}
      </div>
    </section>
  );
}
