export const validateForgotPasswordForm = (formData) => {
  const errors = {};

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Enter a valid email address";
  }

  return errors;
};

export const validateResetPasswordForm = (formData) => {
  const errors = {};

  if (!formData.newPassword) {
    errors.newPassword = "Password is required";
  } else if (formData.newPassword.length < 6) {
    errors.newPassword = "Password must be at least 6 characters";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
