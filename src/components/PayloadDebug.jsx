import React, { useState } from 'react';

export default function PayloadDebug({ payload }) {
  const [isOpen, setIsOpen] = useState(false);

  // Remove signature from display payload (too long) — show truncated
  const displayPayload = {
    ...payload,
    signature: payload.signature
      ? `${payload.signature.slice(0, 60)}… (base64, ${payload.signature.length} chars)`
      : null,
  };

  return (
    <div className="payload-debug">
      <button
        type="button"
        className="debug-toggle"
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className={`debug-arrow ${isOpen ? 'open' : ''}`}>▶</span>
        <span className="debug-label">API Payload Preview</span>
        <span className="debug-badge">DEV</span>
      </button>

      {isOpen && (
        <pre className="debug-payload">
          {JSON.stringify(displayPayload, null, 2)}
        </pre>
      )}
    </div>
  );
}
