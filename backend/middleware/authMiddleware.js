import jwt from "jsonwebtoken";
import { response } from "../helpers/response.js";
import User from "../models/User.js";
import { ApiError } from "../helpers/ApiError.js";
import dotenv from "dotenv";

dotenv.config();

global.blacklistedTokens = new Set();

const authentication = async (req, res, next) => {
  const header = req?.headers?.authorization;
  if (!header) {
    return response(res, req.body, "Missing authorization token.", 401);
  }

  const token = header.includes(" ") ? header.split(" ")[1] : header;

  if (global.blacklistedTokens.has(token)) {
    return response(res, req.body, "Expired or blacklisted authorization token.", 401);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        const refreshToken = req?.headers?.['x-refresh-token'];
        if (!refreshToken) {
          return response(res, req.body, "Missing refresh token.", 401);
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (refreshError, refreshUser) => {
          if (refreshError) {
            return response(res, req.body, "Invalid refresh token.", 403);
          }

          const userRecord = await User.findByPk(refreshUser.id);
          if (!userRecord) {
            return response(res, req.body, "User not found.", 404);
          }

          const newAccessToken = userRecord.generateAccessToken();
          return response(res, req.body, "Access token refreshed successfully.", 200, { accessToken: newAccessToken });
        });
      } else {
        return response(res, req.body, "Invalid authorization token.", 403);
      }
    }

    req.user = user;
    next();
  });
};




export { authentication };
