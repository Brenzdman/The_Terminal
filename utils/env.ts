export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} not set in environment variables`);
  }
  return value;
}

export async function fetchEnvVar(varName: string): Promise<string> {
  try {
    // Step 1: Get the nonce from the server
    const nonceResponse = await fetch(`/api/generateNonce?varName=${varName}`, {
      headers: { "x-server-side-request": "true" },
    });

    if (!nonceResponse.ok) {
      throw new Error(`Failed to get nonce, status: ${nonceResponse.status}`);
    }

    console.log("nonceResponse", nonceResponse);
    const { nonce } = await nonceResponse.json();
    if (!nonce) {
      throw new Error("Failed to generate nonce");
    }

    // Step 2: Send the nonce with the request to fetch the environment variable
    const response = await fetch(`/api/envVars?varName=${varName}`, {
      headers: {
        "x-server-side-request": "true",
        "x-nonce": nonce, // Pass the nonce with the request
      },
    });

    if (!response.ok) {
      throw new Error(`Response returned ${response.status}`);
    }

    const data = await response.json();
    if (!data.value) {
      throw new Error(`Failed to load ${varName}`);
    }

    return data.value;
  } catch (error) {
    // Log the error for debugging
    console.error(`Error fetching environment variable ${varName}:`, error);
    throw new Error(`Failed to fetch ${varName}: ${error}`);
  }
}
