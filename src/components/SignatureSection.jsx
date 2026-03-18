import React, { useRef, useCallback, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PenTool, Pencil, Upload, CloudUpload } from 'lucide-react';

export default function SignatureSection({
  signature,
  signatureMethod,
  error,
  touched,
  onSetSignature,
  onSetMethod,
}) {
  const sigPadRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const resizeCanvasToContainer = useCallback(() => {
    if (!sigPadRef.current || !canvasContainerRef.current) return;

    const existingStrokes = sigPadRef.current.toData();

    const canvas = sigPadRef.current.getCanvas();
    const container = canvasContainerRef.current;
    const rect = container.getBoundingClientRect();

    const cssWidth = Math.max(1, Math.floor(rect.width));
    const cssHeight = Math.max(200, Math.floor(rect.height || 0));
    const dpr = window.devicePixelRatio || 1;

    // Ensure the actual canvas buffer matches CSS size for correct pointer mapping.
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Restore strokes after resize (resizing clears the canvas buffer).
    sigPadRef.current.clear();
    if (existingStrokes?.length) {
      sigPadRef.current.fromData(existingStrokes);
    }
  }, []);

  const saveDrawnSignature = useCallback(() => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      const canvas = sigPadRef.current.getCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      onSetSignature(dataUrl);
    }
  }, [onSetSignature]);

  const handleClearPad = useCallback(() => {
    if (sigPadRef.current) sigPadRef.current.clear();
    onSetSignature(null);
  }, [onSetSignature]);

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== 'image/png') {
        alert('Please upload a PNG image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        onSetSignature(reader.result);
      };
      reader.readAsDataURL(file);
    },
    [onSetSignature]
  );

  const handleMethodSwitch = useCallback(
    (method) => {
      onSetMethod(method);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [onSetMethod]
  );

  useEffect(() => {
    if (signatureMethod !== 'draw') return;

    // Resize after the draw UI has mounted.
    const id = window.requestAnimationFrame(() => resizeCanvasToContainer());

    const handleResize = () => resizeCanvasToContainer();
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener('resize', handleResize);
    };
  }, [signatureMethod, resizeCanvasToContainer]);

  return (
    <section className="form-section">
      <div className="section-header">
        <PenTool />
        <h2>Owner Signature</h2>
      </div>

      <p className="section-hint">
        Draw your signature or upload a PNG image. This will appear on certificates.
      </p>

      {touched && error && <p className="error-message">{error}</p>}

      {/* Method toggle */}
      <div className="signature-toggle">
        <button
          type="button"
          className={`toggle-btn ${signatureMethod === 'draw' ? 'active' : ''}`}
          onClick={() => handleMethodSwitch('draw')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Pencil size={18} /> Draw
        </button>
        <button
          type="button"
          className={`toggle-btn ${signatureMethod === 'upload' ? 'active' : ''}`}
          onClick={() => handleMethodSwitch('upload')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Upload size={18} /> Upload PNG
        </button>
      </div>

      {/* Drawing pad */}
      {signatureMethod === 'draw' && (
        <div className="signature-pad-wrapper">
          <div
            className="signature-canvas-container"
            ref={canvasContainerRef}
            style={{ height: 200 }}
            onMouseUp={saveDrawnSignature}
            onTouchEnd={saveDrawnSignature}
            onPointerUp={saveDrawnSignature}
          >
            <SignatureCanvas
              ref={sigPadRef}
              penColor="#e0e0e0"
              backgroundColor="transparent"
              canvasProps={{
                className: 'signature-canvas',
              }}
              onEnd={saveDrawnSignature}
            />
            <div className="signature-baseline" />
          </div>
          <button
            type="button"
            className="btn-secondary btn-clear-sig"
            onClick={handleClearPad}
          >
            Clear Signature
          </button>
        </div>
      )}

      {/* File upload */}
      {signatureMethod === 'upload' && (
        <div className="signature-upload">
          <label className="upload-area" htmlFor="sig-upload">
            <input
              id="sig-upload"
              ref={fileInputRef}
              type="file"
              accept="image/png"
              className="file-input-hidden"
              onChange={handleFileUpload}
            />
            <span className="upload-icon"><CloudUpload size={48} /></span>
            <span className="upload-text">
              Click to choose a PNG file or drag & drop
            </span>
          </label>
        </div>
      )}

      {/* Preview */}
      {signature && (
        <div className="signature-preview">
          <p className="preview-label">Signature Preview</p>
          <div className="preview-img-wrapper">
            <img src={signature} alt="Signature preview" className="preview-img" />
          </div>
          <button
            type="button"
            className="btn-secondary btn-remove-sig"
            onClick={() => {
              onSetSignature(null);
              if (sigPadRef.current) sigPadRef.current.clear();
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            Remove Signature
          </button>
        </div>
      )}
    </section>
  );
}
