// /utils/nonceStorage.ts
import crypto from "crypto";
// In-memory storage for nonces
const nonceStore = new Map<string, string>();

// Store nonce for a specific variable name
export function storeNonceForVarName(varName: string): string {
  const nonce = generateNonce();
  nonceStore.set(varName, nonce); // Store the nonce in the map with the varName as key
  return nonce;
}

// Retrieve nonce for a specific variable name
export function getNonceForVarName(varName: string): string | undefined {
  return nonceStore.get(varName); // Get the nonce from the map
}

// Remove the nonce once it’s used (to prevent reuse)
export function deleteNonceForVarName(varName: string): void {
  nonceStore.delete(varName); // Delete the nonce from the map
}

// Helper function to generate a secure random nonce
function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}
