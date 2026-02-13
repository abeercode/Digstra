import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const  { handlers, signIn, signOut, auth} = NextAuth ({

  // here the code to connect or sync with supabase profile table 

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
    
      console.log("👤 User signed in via Auth.js:", user.email)
    },
  },
  callbacks: {
    async session({ session, user }) {

      if (session.user) {
        session.user.id = user.id;
        session.user.points= user.points
      }
      return session;
    }
    
  }})
