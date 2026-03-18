import React from 'react';

export default function CertificatePreview({ values }) {
  const hasContacts = values.contacts.some(
    (c) => c.platform.trim() && c.value.trim()
  );

  return (
    <aside className="certificate-preview">
      <div className="preview-card">
        <div className="preview-card-border" />
        <div className="preview-card-inner">
          <div className="preview-card-header">
            <div className="preview-ornament">✦</div>
            <p className="preview-subtitle">Certificate of Authenticity</p>
            <h3 className="preview-gallery-name">
              {values.name || 'Gallery Name'}
            </h3>
          </div>

          <div className="preview-card-body">
            <p className="preview-description">
              {values.description || 'Your gallery description will appear here…'}
            </p>

            {values.email && (
              <div className="preview-field">
                <span className="preview-field-label">Email</span>
                <span className="preview-field-value">{values.email}</span>
              </div>
            )}

            {values.address && (
              <div className="preview-field">
                <span className="preview-field-label">Address</span>
                <span className="preview-field-value">{values.address}</span>
              </div>
            )}

            {hasContacts && (
              <div className="preview-contacts">
                <span className="preview-field-label">Contacts</span>
                <div className="preview-contacts-list">
                  {values.contacts
                    .filter((c) => c.platform.trim() && c.value.trim())
                    .map((c, i) => (
                      <span className="preview-contact-pill" key={i}>
                        {c.platform}: {c.value}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="preview-card-footer">
            {values.signature ? (
              <div className="preview-sig-area">
                <img
                  src={values.signature}
                  alt="Owner signature"
                  className="preview-sig-img"
                />
                <div className="preview-sig-line" />
                <p className="preview-sig-label">Owner Signature</p>
              </div>
            ) : (
              <div className="preview-sig-area preview-sig-placeholder">
                <div className="preview-sig-line" />
                <p className="preview-sig-label">Owner Signature</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
