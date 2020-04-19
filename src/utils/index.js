export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
export function isPhoneNumber(phoneNumber) {
  var p = /^(\+98|0098|0)?9\d{9}$/;
  return p.test(phoneNumber);
}

export function isUrl(url) {
  var regex = /^(\+98|0098|0)?9\d{9}$/;
  return regex.test(url);
}

export const checkStringLimit = (limit, valueLength) => {
  const type = limit.type;
  const min = limit.min ? parseInt(limit.min) : 0;
  const max = limit.max ? parseInt(limit.max) : 1000000;
  let isValid = true;
  let msg;
  if (type === "between") {
    if (valueLength >= min && valueLength <= max) {
    } else {
      isValid = false;
      msg = `Value should be between ${min} and ${max} characters`;
    }
  } else if (type === "atLeast") {
    if (valueLength < min) {
      isValid = false;
      msg = `Value can not be less than ${min} characters`;
    }
  } else {
    if (valueLength < min) {
      isValid = false;
      msg = `Value can not be more than ${max} characters`;
    }
  }
  return { isValid, msg };
};
