import Validator from 'validator';
import isEmpty from './isEmpty';

const validateResetPasswordInput = (data) => {
  let errors = {};
  //isEmpty is own function to check for null, undefined, empty object
  // due to Validate validate based on string so we need this extra step.

  //{password, passwordConfirmation}

  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmedPassword= !isEmpty( data.confirmedPassword) ?  data.confirmedPassword : '';

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.confirmedPassword)) {
    errors.confirmedPassword = 'Password confirmation is required';
  } else {
    if (!Validator.equals(data.password, data.confirmedPassword)) {
      errors.confirmedPassword = 'Passwords must match';
    }
  }
  return {
    errors,
    isValid: isEmpty(errors) //errors object is null mean the request is valid
  };
};

export default  validateResetPasswordInput;

