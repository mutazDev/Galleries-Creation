import React from 'react';
import { MapPin } from 'lucide-react';

export default function AddressSection({ value, error, touched, onChange }) {
  return (
    <section className="form-section">
      <div className="section-header">
        <MapPin />
        <h2>Address</h2>
      </div>

      <div className="field-group">
        <label htmlFor="gallery-address" className="field-label">
          Physical Address <span className="required">*</span>
        </label>
        <textarea
          id="gallery-address"
          className={`field-input field-textarea ${touched && error ? 'field-error' : ''}`}
          placeholder="123 Art Street, Suite 4B&#10;New York, NY 10001&#10;United States"
          rows={3}
          value={value}
          onChange={(e) => onChange('address', e.target.value)}
        />
        {touched && error && <p className="error-message">{error}</p>}
      </div>
    </section>
  );
}
