import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "../../../prisma/next-auth-adapter";
import { EMAIL_TYPES } from "../../../utils/email-utils";
import restClient from "../../../utils/rest-module";

if (!(global as any).prisma) {
  (global as any).prisma = new PrismaClient();
}

const MINUTE_SEC = 60; // seconds
const HOUR_SEC = 60 * MINUTE_SEC;
const DAY_SEC = 24 * HOUR_SEC;

const maxAge = DAY_SEC * 30;

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    Email({
      maxAge: MINUTE_SEC * 20,
      sendVerificationRequest: ({ identifier: email, url }) => {
        return new Promise(async (resolve, reject) => {
          const canEnter = await restClient().get(`/api/mellon`, {
            params: {
              email
            }
          });

          if (!canEnter?.data?.allowed) {
            return reject(new Error("SEND_VERIFICATION_EMAIL_ERROR"));
          }

          let err;

          try {
            await restClient().get(`/api/send_email`, {
              params: {
                email,
                email_type: EMAIL_TYPES.SIGNIN,
                signin_url: url
              }
            });
          } catch (_err) {
            err = _err;
          }

          if (err) {
            console.error("SEND_VERIFICATION_EMAIL_ERROR", { email, err });
            return reject(new Error("SEND_VERIFICATION_EMAIL_ERROR"));
          }

          return resolve();
        });
      }
    })
  ],
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
  // database: process.env.HEROKU_POSTGRESQL_URI,

  adapter: PrismaAdapter((global as any).prisma) as any,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.AUTH_SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    strategy: "database",

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: maxAge,

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: maxAge
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: "/auth/signin", // Displays signin buttons
    signOut: "/auth/signout", // Displays form with sign out button
    error: "/auth/signin", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // Used for check email page

    newUser: "/"
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn(user, account, profile) { return true },
    // async redirect({ url, baseUrl }) { return true },
    // async session(session, user) { return session },
    // async jwt(token, user, account, profile, isNewUser) { return token }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {
    // async signIn(message) { /* on successful sign in */ },
    // async signOut(message) { /* on signout */ },
    // async createUser(message) { /* user created */ },
    // async linkAccount(message) { /* account linked to a user */ },
    // async session(message) { /* session is active */ },
  },
  logger: {
    error: (code, metadata) => {
      console.error("[...nextAuth] error:", { code, metadata });
    }
  },

  // Enable debug messages in the console if you are having problems
  debug: false
});
