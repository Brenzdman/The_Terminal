export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} not set in environment variables`);
  }
  return value;
}


export async function fetchEnvVar(varName: string) {
  const response = await fetch(`/api/envVars?varName=${varName}`);
  const data = await response.json();
  if (!data.value) {
    throw new Error(`Failed to load ${varName}`);
  }
  return data.value;
}