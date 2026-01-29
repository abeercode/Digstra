import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const  { handlers, signIn, signOut, auth} = NextAuth ({
    providers : [ 
            GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),], 
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY, 
  }),
events: {
    async signIn({ user }) {
      // This is where you could manually link sessions if needed,
      // but for now, let's keep it simple. 
      console.log("👤 User signed in via Auth.js:", user.email)
    },
  },
  callbacks: {
    async session({ session, user }) {
      // This makes the User ID available in the session object
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
    
  }})
