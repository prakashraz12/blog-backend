import { tokenVerify } from "../utils/tokenVerfy.utils.js";

export const authenticateUser = async (req, res, next) => {
  //taking token from header
  const authHeader = req.headers.authorization;

  console.log(req.cookies);
  //taking token from cookie
  // const tokenCookie = req.cookies.token;
  //check  token is not in header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = await authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "login first" });
  }

  try {
    //func to verify token

    //  verify _token
    const decoded_Header_Token = await tokenVerify(token);
    // const decoded_cookie_Token = await tokenVerify(tokenCookie);

    if (decoded_Header_Token.id) {
      req.user = decoded_Header_Token.id;
      next();
      
    } else {
      return res.status(403).json({ message: "Not Authorized Person" });
    }
  } catch (error) {
    return res.status(401).json({ mesg: error.message });
  }
};
