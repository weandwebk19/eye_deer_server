const generateCode = () => {
  const digit = 6;
  const number = Math.floor(100000 + Math.random() * 900000);
  return number.toString();
};

module.exports = generateCode;
