import dotenv from 'dotenv'
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import { sendLogInMail } from "../util/sendLogInMail.js";
dotenv.config();

const GOOGLE_REDIRECT_URI = process.env.NODE_ENV == "development" ? process.env.LOCAL_GOOGLE_REDIRECT_URI : process.env.PUBLIC_GOOGLE_REDIRECT_URI;



passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
          // Check if user exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
              // Create new user
              user = await User.create({
                  googleId: profile.id,
                  fullName: profile.displayName,
                  email: profile.emails[0].value,
                  profilePicture: profile.photos[0].value
              });

              sendLogInMail( profile.emails[0].value,profile.displayName);
          }
   
           

          return done(null, user); // passes user to callback route
      } catch (err) {
          return done(err, null);
      }
  }
  ));

export default passport;