import Validator from 'validator';
import isEmpty from './isEmpty';

const validateChangePassword = (data) => {
  let errors = {};
  //isEmpty is own function to check for null, undefined, empty object
  // due to Validate validate based on string so we need this extra step.

  data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : '';
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : '';
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

  if (Validator.isEmpty(data.oldPassword)) {
    errors.oldPassword = 'Old Password field is required';
  }
  if (Validator.isEmpty(data.newPassword)) {
    errors.newPassword = 'New Password field is required';
  }

  if (!Validator.isLength(data.newPassword, { min: 6, max: 30 })) {
    errors.newPassword = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword= 'Confirm New Password field is required';
  } else {
    if (!Validator.equals(data.newPassword, data.confirmPassword)) {
      errors.confirmPassword = 'Confirm password must be matched';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors) //errors object is null mean the request is valid
  };
};

export default  validateChangePassword;

