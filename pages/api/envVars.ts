import type { NextApiRequest, NextApiResponse } from "next";
import { getEnvVar } from "@/utils/env";

// TODO practice security
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { varName } = req.query;

  if (typeof varName !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  try {
    const envVarValue = getEnvVar(varName);
    res.status(200).json({ value: envVarValue });
  } catch (error) {
    res.status(500).json({ error: "Failed to load variable" });
  }
}