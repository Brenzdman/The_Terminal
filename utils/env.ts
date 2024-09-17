import crypto from "crypto";

export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} not set in environment variables`);
  }
  return value;
}

// Generate a secure random nonce
function generateNonce() {
  return crypto.randomBytes(16).toString("hex");
}

export async function fetchEnvVar(varName: string) {
  // Step 1: Generate the nonce
  const nonce = generateNonce();

  let response;
  try {
    // Step 2: Send the nonce in the request header
    response = await fetch(`/api/envVars?varName=${varName}`, {
      headers: {
        "x-server-side-request": "true",
        "x-nonce": nonce, // Pass the nonce with the request
      },
    });

    if (!response.ok) {
      throw new Error(`Response returned ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to fetch ${varName}, ${error}`);
  }

  const data = await response.json();
  if (!data.value) {
    throw new Error(`Failed to load ${varName}`);
  }
  return data.value;
}
