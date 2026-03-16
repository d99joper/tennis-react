// utils/googleLoginFlow.js

export const extractBasicProfileData = (user) => ({
  email: user.email,
  firstName: user.first_name || user.firstName,
  lastName: user.last_name || user.lastName,
  google_id: user.google_id,
  picture: user.picture,
});

export const updateFormWithPlayer = (setFormState, user) => {
  const profile = extractBasicProfileData(user);
  setFormState((prev) => ({
    ...prev,
    data: {
      ...prev.data,
      ...profile,
      name: `${profile.firstName} ${profile.lastName}`.trim(),
      player: user,
    },
  }));
};

export const updateFormState = (setFormState, key, value, isError = false) => {
  setFormState((prev) => ({
    ...prev,
    [isError ? 'errors' : 'data']: {
      ...prev[isError ? 'errors' : 'data'],
      [key]: value,
    },
  }));
};

const defaultValidators = {
  email: (val) => {
    if (!val || val.length > 254) return 'Please provide a valid email.';
    // Django-compatible email pattern (accepts unicode, no control characters)
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return !regex.test(val) && 'Please provide a valid email.';
  },
  firstName: (val) => (!val || val.trim().length < 1) && 'Please provide a longer first name.',
  lastName: (val) => (!val || val.trim().length < 1) && 'Please provide a longer last name.',
  age: (val) => (!val || isNaN(val)) && 'Please provide a valid birth year.',
  location: (val) => (!val || val.trim().length < 1) && 'Please provide a location.',
};

export const validateFormFields = (formState, customValidators = {}) => {
  const newErrors = {};
  const validators = { ...defaultValidators, ...customValidators };

  for (const key of Object.keys(validators)) {
    const value = formState.data[key];
    const validator = validators[key];
    if (validator) {
      const error = validator(value);
      if (error) newErrors[key] = error;
    }
  }

  return {
    newErrors,
    hasErrors: Object.values(newErrors).some(Boolean),
  };
};
