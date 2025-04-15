import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
