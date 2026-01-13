import * as dotenv from 'dotenv'
dotenv.config()

const requireEnv = ["MONGO_DB_URL", "REFRESH_TOKEN_EXPIRY","ACCESS_TOKEN_EXPIRY","ACCESS_TOKEN_SECRET","REFRESH_TOKEN_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET" ] as const;

for (const key of requireEnv){
    if(!process.env[key]){
        throw new Error(`Missing Environment Variables : ${key}`)
    }
}

export const env: {
  MONGO_DB_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRY: string;
  ACCESS_TOKEN_EXPIRY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_FROM: string;

} = {
  MONGO_DB_URL: process.env.MONGO_DB_URL!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY!,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  EMAIL_HOST: process.env.EMAIL_HOST!,
  EMAIL_PORT: Number(process.env.EMAIL_PORT!),
  EMAIL_USER: process.env.EMAIL_USER!,
  EMAIL_PASS: process.env.EMAIL_PASS!,
  EMAIL_FROM: process.env.EMAIL_FROM!,

};