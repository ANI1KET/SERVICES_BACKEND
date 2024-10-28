import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT;
export const ACCESS_TOKEN_JWT_SECRET = process.env.ACCESS_TOKEN_JWT_SECRET!;
export const REFRESH_TOKEN_JWT_SECRET = process.env.REFRESH_TOKEN_JWT_SECRET!;
