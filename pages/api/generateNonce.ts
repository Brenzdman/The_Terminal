// /api/generateNonce.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { storeNonceForVarName } from "@/utils/nonceStorage";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { varName } = req.query;

  if (typeof varName !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  // Store nonce and send it back to the client
  const nonce = storeNonceForVarName(varName);
  return res.status(200).json({ nonce });
}
