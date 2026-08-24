export function validatePersonalInfo(form) {
  const errors = {};

  if (!form.phone?.trim()) errors.phone = "Phone number is required";
  else if (!/^[0-9+\-\s]{8,20}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  if (!form.profileTitle?.trim()) errors.profileTitle = "Profile title is required";
  if (!form.location?.trim()) errors.location = "Location is required";
  if (!form.experienceLevel?.trim()) errors.experienceLevel = "Experience level is required";

  if (form.expectedSalary && form.expectedSalary.length > 50) {
    errors.expectedSalary = "Expected salary must be less than 50 characters";
  }

  return errors;
}

export function validateProfileImage(file) {
  const errors = {};
  if (!file) return errors;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    errors.profileImage = "Only JPG, PNG, or WEBP images are allowed";
  }

  if (file.size > 2 * 1024 * 1024) {
    errors.profileImage = "Profile image must be less than 2 MB";
  }

  return errors;
}

export function validateResumeFile(file) {
  const errors = {};
  if (!file) {
    errors.resume = "Resume file is required";
    return errors;
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const allowedExtensions = ["pdf", "doc", "docx"];
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
    errors.resume = "Only PDF, DOC, or DOCX files are allowed";
  }

  if (file.size > 5 * 1024 * 1024) {
    errors.resume = "Resume size must be less than 5 MB";
  }

  return errors;
}

export function validateEducation(education) {
  const errors = {};
  if (!education.degree?.trim()) errors.degree = "Degree is required";
  if (!education.institute?.trim()) errors.institute = "Institute is required";
  if (!education.passingYear?.trim()) errors.passingYear = "Passing year is required";
  return errors;
}

export function validateExperience(experience) {
  const errors = {};
  if (!experience.companyName?.trim()) errors.companyName = "Company name is required";
  if (!experience.jobTitle?.trim()) errors.jobTitle = "Job title is required";
  if (!experience.startDate?.trim()) errors.startDate = "Start date is required";
  return errors;
}

export function validateSocialLink(link, existingLinks = []) {
  const errors = {};

  if (!link.platform) errors.platform = "Platform is required";

  if (!link.url?.trim()) errors.url = "URL is required";
  else if (!/^https?:\/\/.+/i.test(link.url.trim())) {
    errors.url = "URL must start with http:// or https://";
  }

  if (link.platform && existingLinks.some((existing) => existing.platform === link.platform)) {
    errors.platform = "This platform is already added";
  }

  return errors;
}

export function validateAccountSettings(settings) {
  const errors = {};
  ["profileVisible", "jobAlertEnabled", "emailNotificationEnabled"].forEach((field) => {
    if (typeof settings[field] !== "boolean") {
      errors[field] = "Invalid value";
    }
  });
  return errors;
}
