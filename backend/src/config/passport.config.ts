import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../models/user.model.js"
import { env } from "./env.js"

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) {
          return done(new Error("No email provided by Google"));
        }
        let user = await User.findOne({ email });

        if (user) {
          // User exists, return it
          return done(null, user);
        }

        // Create new user from Google profile
        user = await User.create({
          userName: profile.displayName?.replace(/\s+/g, "").toLowerCase() || `user${Date.now()}`,
          fullName: profile.displayName || "Google User",
          email: email,
          // password is optional for OAuth users
          avatar: profile.photos?.[0]?.value || "https://ui-avatars.com/api/?name=Google User",
        });
        // console.log(profile)

        return done(null, user);
      } catch (error: any) {
        return done(error)
      }
    }
  )
)

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id)
})

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

export default passport
