export default function handler(req: any, res: any) {
  const { identifier, passcode } = req.body;

  if (!identifier || !passcode) {
    return res.status(400).json({
      success: false,
      message: "BAD REQUEST",
    });
  }

  // Mapping identifier to the corresponding secret from the environment variables
  let secret;
  switch (identifier) {
    case "ASCII":
      secret = process.env.ASCII_DECODE;
      break;
    default:
      return res
        .status(400)
        .json({ success: false, message: "Invalid identifier" });
  }

  // Compare the provided passcode with the secret
  if (passcode === secret) {
    return res
      .status(200)
      .json({ success: true, message: "Passcode matched!" });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Passcode incorrect" });
  }
}
