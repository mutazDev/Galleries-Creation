import { useState, useCallback, useMemo } from 'react';
import { createGallery } from '../services/galleryApi';

const INITIAL_CONTACT = { platform: '', value: '' };

const INITIAL_STATE = {
  name: '',
  description: '',
  email: '',
  contacts: [{ ...INITIAL_CONTACT }],
  address: '',
  signature: null, // base64 string
  signatureMethod: 'draw', // 'draw' | 'upload'
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Gallery name is required.';
  if (!values.description.trim()) errors.description = 'Description is required.';
  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.address.trim()) errors.address = 'Address is required.';
  if (!values.signature) errors.signature = 'Signature is required.';

  // Validate contacts — at least one complete row
  const filledContacts = values.contacts.filter(
    (c) => c.platform.trim() && c.value.trim()
  );
  if (filledContacts.length === 0) {
    errors.contacts = 'At least one contact is required.';
  }

  // Per-row contact validation
  const contactErrors = values.contacts.map((c) => {
    const rowErr = {};
    if (c.platform.trim() && !c.value.trim()) rowErr.value = 'Value is required.';
    if (!c.platform.trim() && c.value.trim()) rowErr.platform = 'Platform is required.';
    return Object.keys(rowErr).length ? rowErr : null;
  });
  if (contactErrors.some(Boolean)) errors.contactRows = contactErrors;

  return errors;
}

export default function useGalleryForm() {
  const [values, setValues] = useState({ ...INITIAL_STATE });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [apiResponse, setApiResponse] = useState(null);
  const [touched, setTouched] = useState({});

  // --- Field handlers ---

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Clear field error on change
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // --- Contact handlers ---

  const addContact = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { ...INITIAL_CONTACT }],
    }));
  }, []);

  const removeContact = useCallback((index) => {
    setValues((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  }, []);

  const updateContact = useCallback((index, field, value) => {
    setValues((prev) => {
      const contacts = [...prev.contacts];
      contacts[index] = { ...contacts[index], [field]: value };
      return { ...prev, contacts };
    });
    setTouched((prev) => ({ ...prev, contacts: true }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.contacts;
      delete next.contactRows;
      return next;
    });
  }, []);

  // --- Signature handlers ---

  const setSignature = useCallback((base64OrNull) => {
    setValues((prev) => ({ ...prev, signature: base64OrNull }));
    setTouched((prev) => ({ ...prev, signature: true }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.signature;
      return next;
    });
  }, []);

  const setSignatureMethod = useCallback((method) => {
    setValues((prev) => ({ ...prev, signatureMethod: method, signature: null }));
  }, []);

  // --- Payload builder ---

  const buildPayload = useCallback(() => {
    const contactsDict = {};
    values.contacts
      .filter((c) => c.platform.trim() && c.value.trim())
      .forEach((c) => {
        contactsDict[c.platform.trim()] = c.value.trim();
      });

    return {
      name: values.name.trim(),
      description: values.description.trim(),
      email: values.email.trim(),
      contacts: contactsDict,
      address: values.address.trim(),
      signature: values.signature, // base64 string
    };
  }, [values]);

  // --- Submit ---

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const validationErrors = validate(values);
      setErrors(validationErrors);

      // Mark all fields as touched
      setTouched({
        name: true,
        description: true,
        email: true,
        contacts: true,
        address: true,
        signature: true,
      });

      if (Object.keys(validationErrors).length > 0) {
        // Yield to allow React to render the newly-touched error elements
        setTimeout(() => {
          const firstErrorId = Object.keys(validationErrors)[0];
          const firstErrorElement = document.querySelector('.field-error, .error-message');
          
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Try to focus the specific element or roughly near the element to help screen readers and keyboard navigation
            if (firstErrorElement.tagName === 'INPUT' || firstErrorElement.tagName === 'TEXTAREA') {
              firstErrorElement.focus({ preventScroll: true });
            } else if (firstErrorElement.parentElement) {
              const input = firstErrorElement.parentElement.querySelector('input, textarea');
              if (input) input.focus({ preventScroll: true });
            }
          }
        }, 0);
        return;
      }

      setStatus('loading');
      setApiResponse(null);

      try {
        const payload = buildPayload();
        const response = await createGallery(payload);
        setApiResponse(response);
        setStatus('success');
      } catch (err) {
        setApiResponse(err);
        setStatus('error');
      }
    },
    [values, buildPayload]
  );

  // --- Reset ---

  const resetForm = useCallback(() => {
    setValues({ ...INITIAL_STATE, contacts: [{ ...INITIAL_CONTACT }] });
    setErrors({});
    setStatus('idle');
    setApiResponse(null);
    setTouched({});
  }, []);

  // --- Derived ---

  const payload = useMemo(() => buildPayload(), [buildPayload]);

  const isValid = useMemo(
    () => Object.keys(validate(values)).length === 0,
    [values]
  );

  return {
    values,
    errors,
    touched,
    status,
    apiResponse,
    isValid,
    payload,
    handleChange,
    addContact,
    removeContact,
    updateContact,
    setSignature,
    setSignatureMethod,
    handleSubmit,
    resetForm,
  };
}
