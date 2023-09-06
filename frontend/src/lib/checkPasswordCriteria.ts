export default function checkPasswordCriteria(password: string): string {
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const uppercaseChars = /[A-Z]/;
  const lowercaseChars = /[a-z]/;
  const numberChars = /[0-9]/;

  if (password.length < 12) {
    return 'length must be at least 12 characters long.';
  }
  if (!uppercaseChars.test(password)) {
    return 'needs to have at least one uppercase characters.';
  }
  if (!lowercaseChars.test(password)) {
    return 'needs to have at least one lowercase characters.';
  }
  if (!numberChars.test(password)) {
    return 'must have at least one number.';
  }
  if (!specialChars.test(password)) {
    return 'does not contain any special characters.';
  }
  return '';
}
