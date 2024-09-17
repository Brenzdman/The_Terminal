import type { NextApiRequest, NextApiResponse } from "next";
import { getEnvVar } from "@/utils/env";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { varName } = req.query;

  // Check if the varName is valid
  if (typeof varName !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  // Additional server-side request verification (check origin IP or headers)
  const serverSideHeader = req.headers["x-server-side-request"];
  const forwardedFor =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Allow only requests from the server (localhost or a known IP range)
  const allowedIPs = ["127.0.0.1", "::1"]; // You can add more trusted IPs if needed
  if (!serverSideHeader || !allowedIPs.includes(forwardedFor as string)) {
    return res
      .status(403)
      .json({ error: "Forbidden: server-side requests only" });
  }

  // If all checks pass, retrieve the environment variable
  try {
    const envVarValue = getEnvVar(varName);
    return res.status(200).json({ value: envVarValue });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load variable" });
  }
}
