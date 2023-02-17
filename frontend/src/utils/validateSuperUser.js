import Validator from 'validator';
import isEmpty from './isEmpty';

const validateSuperUserInput = (user) => {
  let errors = {};
  //isEmpty is own function to check for null, undefined, empty object
  // due to Validate validate based on string so we need this extra step.

  //{username, password, passwordConfirmation, email, phone, usertype}

  user.username = !isEmpty(user.username) ? user.username : '';
  user.email = !isEmpty(user.email) ? user.email : '';
  user.password = !isEmpty(user.password) ? user.password : '';
  user.passwordConfirmation = !isEmpty(user.passwordConfirmation) ? user.passwordConfirmation : '';
  user.phone = !isEmpty(user.phone) ? user.phone : '';
  user.usertype = !isEmpty(user.usertype) ? user.usertype : '';

  if (!Validator.isLength(user.username, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(user.username)) {
    errors.name = 'Name is required';
  }

  if (Validator.isEmpty(user.email)) {
    errors.email = 'Email is required';
  }

  if (!Validator.isEmail(user.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(user.password)) {
    errors.password = 'Password is required';
  }

  if (!Validator.isLength(user.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(user.passwordConfirmation)) {
    errors.confirmed_password = 'Confirm Password field is required';
  } else {
    if (!Validator.equals(user.password, user.passwordConfirmation)) {
      errors.confirmed_password = 'Passwords must match';
    }
  }

  if (Validator.isEmpty(user.phone)) {
    errors.phone = 'Phone is required';
  }
  if(!/^[0,84][1-9][0-9]{8}$/.test(user.phone)) {
    errors.phone = ' Phone number is invalid.';
  }

  if (Validator.isEmpty(user.usertype)) {
    errors.type = 'User type is required';
  }

  const isValidUserType = (user.usertype ==='vip' || user.usertype ==='normal')
  if(!isValidUserType) {
     errors.type="User type is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors) //errors object is null mean the request is valid
  };
};

export default  validateSuperUserInput;






