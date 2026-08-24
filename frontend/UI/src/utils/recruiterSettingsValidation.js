export const validateCompanyInfo = (data) => {
  const errors = {};

  if (!data.companyName.trim()) {
    errors.companyName = "Company name is required";
  }

  if (!data.aboutUs.trim()) {
    errors.aboutUs = "About company is required";
  } else if (data.aboutUs.trim().length < 30) {
    errors.aboutUs = "About company must be at least 30 characters";
  }

  return errors;
};

export const validateFoundingInfo = (data) => {
  const errors = {};

  if (!data.organizationType) {
    errors.organizationType = "Please select organization type";
  }

  if (!data.industryType) {
    errors.industryType = "Please select industry type";
  }

  if (!data.teamSize) {
    errors.teamSize = "Please select team size";
  }

  if (!data.yearOfEstablishment) {
    errors.yearOfEstablishment = "Year of establishment is required";
  }

  if (data.companyWebsite.trim()) {
    const websiteRegex =
      /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

    if (!websiteRegex.test(data.companyWebsite.trim())) {
      errors.companyWebsite = "Enter a valid website URL";
    }
  }

  return errors;
};

// socialLinks is {facebook, twitter, linkedin, instagram} - Company stores these
// as 4 fixed columns, not a list, and none of them are required.
export const validateRecruiterSocialLinks = (socialLinks) => {
  const errors = {};
  const urlRegex =
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

  Object.entries(socialLinks).forEach(([platform, url]) => {
    if (url?.trim() && !urlRegex.test(url.trim())) {
      errors[platform] = "Enter a valid profile URL";
    }
  });

  return errors;
};

export const validateRecruiterPassword = (data) => {
  const errors = {};

  if (!data.currentPassword.trim()) {
    errors.currentPassword = "Current password is required";
  }

  if (!data.newPassword.trim()) {
    errors.newPassword = "New password is required";
  } else if (data.newPassword.length < 6) {
    errors.newPassword = "Password must be at least 6 characters";
  }

  if (!data.confirmPassword.trim()) {
    errors.confirmPassword = "Confirm password is required";
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
