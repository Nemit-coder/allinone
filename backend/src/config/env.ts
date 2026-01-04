import dotenv from 'dotenv'

dotenv.config()

const requireEnv = ["MONGO_DB_URL"] as const;

for (const key of requireEnv){
    if(!process.env[key]){
        throw new Error(`Missing Environment Variables : ${key}`)
    }
}

export const env: {
  MONGO_DB_URL: string;
} = {
  MONGO_DB_URL: process.env.MONGO_DB_URL as string
};