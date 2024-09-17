import type { NextApiRequest, NextApiResponse } from "next";
import { getEnvVar } from "@/utils/env";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { varName } = req.query;

  if (typeof varName !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  // Check if the request is coming from the server-side
  const serverSideHeader = req.headers["x-server-side-request"];
  const allowedIPs = ["127.0.0.1", "::1", "76.76.21.142", "76.76.21.241"];

  const forwardedFor =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!serverSideHeader) {
    return res
      .status(403)
      .json({ error: "Forbidden: server-side requests only" });
  }

  if (!allowedIPs.includes(forwardedFor as string)) {
    return res.status(403).json({ error: "Forbidden: ip not allowed" });
  }

  try {
    const envVarValue = getEnvVar(varName);
    return res.status(200).json({ value: envVarValue });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load variable" });
  }
}
