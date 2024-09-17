import type { NextApiRequest, NextApiResponse } from "next";
import { getEnvVar } from "@/utils/env";

// This would be a cache or memory store for the nonce.
// In production, use something like Redis for better performance and persistence.
const usedNonces = new Set();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { varName } = req.query;

  if (typeof varName !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  // Step 3: Validate the nonce
  const nonce = req.headers["x-nonce"];
  if (!nonce || usedNonces.has(nonce)) {
    return res.status(403).json({ error: "Invalid or reused nonce" });
  }

  // Step 4: Mark the nonce as used
  usedNonces.add(nonce);

  // Optionally, you can expire nonces after a certain period of time
  setTimeout(() => usedNonces.delete(nonce), 60000); // Expire nonce after 60 seconds

  // Step 5: Ensure server-side request
  const serverSideHeader = req.headers["x-server-side-request"];
  if (!serverSideHeader) {
    return res
      .status(403)
      .json({ error: "Forbidden: server-side requests only" });
  }

  // Get environment variable
  try {
    const envVarValue = getEnvVar(varName);
    return res.status(200).json({ value: envVarValue });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load variable" });
  }
}
