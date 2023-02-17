import Validator from 'validator';
import isEmpty from './isEmpty';

const validateUserInput = (user) => {
  let errors = {};
  //isEmpty is own function to check for null, undefined, empty object
  // due to Validate validate based on string so we need this extra step.

  //{username, password, passwordConfirmation, email, phone, unit}

  user.username = !isEmpty(user.username) ? user.username : '';
  user.email = !isEmpty(user.email) ? user.email : '';
  user.password = !isEmpty(user.password) ? user.password : '';
  user.passwordConfirmation = !isEmpty(user.passwordConfirmation) ? user.passwordConfirmation : '';
  user.phone = !isEmpty(user.phone) ? user.phone : '';
  user.unit = !isEmpty(user.unit) ? user.unit : '';


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



  /*

  if (user.phone!== /^[0,84][1-9][0-9]{8}$/) {
    errors.phone = ' Phone number is invalid.';
  }
  */
  /*
  const pattern = /^[0,84][1-9][0-9]{8}$/;
  const result = user.phone.match(pattern);
  if (!result) {
    errors.phone = ' Phone number is invalid.';
  } else {
    alert (result);
  }
  */

  if (Validator.isEmpty(user.unit)) {
    errors.unit = 'Unit is required';
  }

  if (!Validator.isLength(user.unit, { min: 2, max: 30 })) {
    errors.unit = 'Unit name must be between 2 and 30 characters';
  }




  return {
    errors,
    isValid: isEmpty(errors) //errors object is null mean the request is valid
  };
};


export default  validateUserInput;

