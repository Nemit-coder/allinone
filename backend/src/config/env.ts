import * as dotenv from 'dotenv'
dotenv.config()

const requireEnv = ["MONGO_DB_URL", "REFRESH_TOKEN_EXPIRY","ACCESS_TOKEN_EXPIRY","ACCESS_TOKEN_SECRET","REFRESH_TOKEN_SECRET" ] as const;

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
} = {
  MONGO_DB_URL: process.env.MONGO_DB_URL!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY!,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY!,
};