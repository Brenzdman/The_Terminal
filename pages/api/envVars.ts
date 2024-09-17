// /api/envVars.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getEnvVar } from "@/utils/env";
import {
  getNonceForVarName,
  deleteNonceForVarName,
} from "@/utils/nonceStorage"; // Import nonce retrieval and deletion functions

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { varName } = req.query;

  if (typeof varName !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  // Step 1: Retrieve the nonce for the given varName
  const nonce = req.headers["x-nonce"];
  const storedNonce = getNonceForVarName(varName);

  // Step 2: Validate the nonce
  if (!nonce || nonce !== storedNonce) {
    return res.status(403).json({ error: "Invalid or missing nonce" });
  }

  // Step 3: Once the nonce is validated, remove it to prevent reuse
  deleteNonceForVarName(varName);

  // Fetch the environment variable
  try {
    const envVarValue = getEnvVar(varName);
    return res.status(200).json({ value: envVarValue });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load variable" });
  }
}
