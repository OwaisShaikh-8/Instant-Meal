import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userid, res) => {
  const token = jwt.sign(
    { userid },
    process.env.JWT_TOKEN,
    { expiresIn: "20h" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,   // prevents XSS
    secure: true,     // HTTPS only
    sameSite: "Strict", // CSRF protection
    maxAge: 20 * 60 * 60 * 1000
  });

  return token; // ✅ THIS WAS MISSING
};

export default createTokenAndSaveCookie;
