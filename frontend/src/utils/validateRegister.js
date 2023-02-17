import Validator from 'validator';
import isEmpty from './isEmpty';

const validateRegisterInput = (data) => {
  let errors = {};
  //isEmpty is own function to check for null, undefined, empty object
  // due to Validate validate based on string so we need this extra step.
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmed_password = !isEmpty(data.confirmed_password) ? data.confirmed_password : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.confirmed_password)) {
    errors.confirmed_password = 'Confirm Password field is required';
  } else {
    if (!Validator.equals(data.password, data.confirmed_password)) {
      errors.confirmed_password = 'Passwords must match';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors) //errors object is null mean the request is valid
  };
};


export default  validateRegisterInput;

