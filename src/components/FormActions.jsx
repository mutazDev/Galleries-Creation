import React from 'react';

export default function FormActions({ status, onReset }) {
  const isLoading = status === 'loading';

  return (
    <div className="form-actions">
      <button
        type="submit"
        className={`btn-primary btn-submit ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            Creating Gallery…
          </>
        ) : (
          'Create Gallery'
        )}
      </button>

      <button
        type="button"
        className="btn-secondary btn-reset"
        onClick={onReset}
        disabled={isLoading}
      >
        Reset Form
      </button>
    </div>
  );
}
