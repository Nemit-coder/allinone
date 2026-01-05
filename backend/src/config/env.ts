import * as dotenv from 'dotenv'
dotenv.config()

const requireEnv = ["MONGO_DB_URL", "JWT_SECRET"] as const;

for (const key of requireEnv){
    if(!process.env[key]){
        throw new Error(`Missing Environment Variables : ${key}`)
    }
}

export const env: {
  MONGO_DB_URL: string;
  JWT_SECRET: string;
} = {
  MONGO_DB_URL: process.env.MONGO_DB_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string
};