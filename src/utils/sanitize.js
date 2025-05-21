export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') 
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '')
    .trim();
};

export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return email;
  return email.toLowerCase().trim();
};

export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return phone;
  return phone.replace(/[^0-9+]/g, '');
};

export const sanitizeCardNumber = (cardNumber) => {
  if (typeof cardNumber !== 'string') return cardNumber;
  return cardNumber.replace(/[^0-9]/g, '');
};

export const sanitizeZipCode = (zipCode) => {
  if (typeof zipCode !== 'string') return zipCode;
  return zipCode.replace(/[^0-9-]/g, '');
};
