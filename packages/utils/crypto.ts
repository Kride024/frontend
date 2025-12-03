// packages/utils/src/Crypto.ts
const secretKey = import.meta.env.VITE_Crypto_SECRET_KEY as string;

if (!secretKey) {
  console.warn("VITE_Crypto_SECRET_KEY is missing in .env");
}

export const encryptData = (data: any): string => {
  if (!secretKey) return "";
  return Crypto.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (encrypted: string): any => {
  if (!encrypted || !secretKey) return null;
  try {
    const bytes = Crypto.AES.decrypt(encrypted, secretKey);
    const decrypted = bytes.toString(Crypto.enc.Utf8);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};