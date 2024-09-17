export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} not set in environment variables`);
  }
  return value;
}

export async function fetchEnvVar(varName: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  let response;
  try {
    response = await fetch(`${baseUrl}/api/envVars?varName=${varName}`, {
      headers: {
        "x-server-side-request": "true",
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
