const bcrypt = require('bcryptjs');

const generatePasswordHash = async (senha) => {
  const saltRounds = 10;
  return await bcrypt.hash(senha, saltRounds);
};

const verifyPassword = async (senha, hash) => {
  return await bcrypt.compare(senha, hash);
};

const generateCredentials = () => {
  const username = `user_${Math.random().toString(36).substring(2, 11)}`;
  const password = generatePassword();
  return { username, password };
};

const generatePassword = () => {
  let str = Math.random().toString(36).substring(2, 14).split('');

  const upperCaseIndex = Math.floor(Math.random() * str.length);
  const upperCaseChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  str[upperCaseIndex] = upperCaseChar;

  const specialChars = '!@#$%&*_-+=';
  let specialCharIndex = Math.floor(Math.random() * str.length);;

  const specialChar =
  specialChars[Math.floor(Math.random() * specialChars.length)];

  if (specialCharIndex === upperCaseIndex) {
    specialCharIndex = (specialCharIndex + 1) % str.length;
  }

  str[specialCharIndex] = specialChar;

  const numbers = '0123456789';
  let numberIndex;

  do {
    numberIndex = Math.floor(Math.random() * str.length);
  } while (
    numberIndex === upperCaseIndex ||
    numberIndex === specialCharIndex
  );

  const number = numbers[Math.floor(Math.random() * numbers.length)];
  str[numberIndex] = number;

  return str.join('');
};

const generateTempEmail = (nome) => {
  const base = nome
    .toLowerCase()
    .normalize('NFD')                     
    .replace(/[\u0300-\u036f]/g, '')     
    .replace(/[^a-z0-9 ]/g, '')          
    .replace(/\s+/g, '.');                

  const random = Math.random().toString(36).substring(2, 7);
  return `${base}.${random}@centralcompras.com`;
};

module.exports = {
  generatePasswordHash,
  verifyPassword,
  generateCredentials,
  generateTempEmail
};
