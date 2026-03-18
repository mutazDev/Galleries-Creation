import React from 'react';
import useGalleryForm from '../hooks/useGalleryForm';
import BasicInfoSection from '../components/BasicInfoSection';
import ContactsSection from '../components/ContactsSection';
import AddressSection from '../components/AddressSection';
import SignatureSection from '../components/SignatureSection';
import CertificatePreview from '../components/CertificatePreview';
import FormActions from '../components/FormActions';
import PayloadDebug from '../components/PayloadDebug';

export default function GalleryCreationPage() {
  const {
    values,
    errors,
    touched,
    status,
    apiResponse,
    payload,
    handleChange,
    addContact,
    removeContact,
    updateContact,
    setSignature,
    setSignatureMethod,
    handleSubmit,
    resetForm,
  } = useGalleryForm();

  return (
    <div className="page-wrapper">
      {/* Hero header */}
      <header className="page-header">
        <div className="header-glow" />
        <h1 className="page-title">Create Your Gallery</h1>
        <p className="page-subtitle">
          Set up your gallery profile — this information will be used for publishing artworks and generating certificates of authenticity.
        </p>
      </header>

      <div className="page-content">
        {/* Form column */}
        <main className="form-column">
          <form onSubmit={handleSubmit} noValidate>
            <BasicInfoSection
              values={values}
              errors={errors}
              touched={touched}
              onChange={handleChange}
            />

            <ContactsSection
              contacts={values.contacts}
              errors={errors}
              touched={touched}
              onAdd={addContact}
              onRemove={removeContact}
              onUpdate={updateContact}
            />

            <AddressSection
              value={values.address}
              error={errors.address}
              touched={touched.address}
              onChange={handleChange}
            />

            <SignatureSection
              signature={values.signature}
              signatureMethod={values.signatureMethod}
              error={errors.signature}
              touched={touched.signature}
              onSetSignature={setSignature}
              onSetMethod={setSignatureMethod}
            />

            <FormActions
              status={status}
              onReset={resetForm}
            />
          </form>

          {/* Status feedback */}
          {status === 'success' && (
            <div className="feedback feedback-success">
              <span className="feedback-icon">✅</span>
              <div>
                <strong>{apiResponse?.message}</strong>
                <p className="feedback-detail">
                  Gallery ID: <code>{apiResponse?.data?.id}</code>
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="feedback feedback-error">
              <span className="feedback-icon">❌</span>
              <div>
                <strong>{apiResponse?.message || 'Something went wrong.'}</strong>
                <p className="feedback-detail">Please try again.</p>
              </div>
            </div>
          )}

          {/* Debug payload */}
          <PayloadDebug payload={payload} />
        </main>

        {/* Certificate preview column */}
        <CertificatePreview values={values} />
      </div>
    </div>
  );
}
