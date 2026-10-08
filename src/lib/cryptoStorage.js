import CryptoJS from "crypto-js";

const CUSTOMER_SECRET_KEY =
  import.meta.env.VITE_CUSTOMER_STORAGE_ENCRYPTION_KEY;
export const CUSTOMER_TOKEN_NAME =
  import.meta.env.VITE_CUSTOMERTOKEN_NAME;

/**
 * Encrypt customer _id using VITE_CUSTOMER_STORAGE_ENCRYPTION_KEY
 */
export const encryptCustomerId = (plainId) => {
  if (!plainId) return "";
  try {
    return CryptoJS.AES.encrypt(String(plainId), CUSTOMER_SECRET_KEY).toString();
  } catch (error) {
    console.error("Customer ID encryption error:", error);
    return String(plainId);
  }
};

/**
 * Decrypt customer _id using VITE_CUSTOMER_STORAGE_ENCRYPTION_KEY
 */
export const decryptCustomerId = (cipherText) => {
  if (!cipherText) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, CUSTOMER_SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || cipherText;
  } catch {
    return cipherText;
  }
};

/**
 * Store encrypted customer _id into localStorage under VITE_CUSTOMERTOKEN_NAME key
 */
export const storeEncryptedCustomerId = (customerId) => {
  if (!customerId) {
    localStorage.removeItem(CUSTOMER_TOKEN_NAME);
    return;
  }
  const encrypted = encryptCustomerId(customerId);
  localStorage.setItem(CUSTOMER_TOKEN_NAME, encrypted);
};

/**
 * Retrieve and decrypt customer _id from localStorage
 */
export const getDecryptedCustomerId = () => {
  const cipher = localStorage.getItem(CUSTOMER_TOKEN_NAME);
  if (!cipher) return "";
  return decryptCustomerId(cipher);
};

/**
 * Remove encrypted customer _id from localStorage
 */
export const removeEncryptedCustomerId = () => {
  localStorage.removeItem(CUSTOMER_TOKEN_NAME);
};