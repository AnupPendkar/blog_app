import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import 'dotenv/config';
import { userRegister } from '../controllers/userControllers';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:8005/api/auth/google/callback',
      passReqToCallback: true,
      Proxy: true
    },
    (request, accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
