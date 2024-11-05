import { supabase } from "@/lib/supabase";
import * as AuthSession from 'expo-auth-session';

export async function signInGoogle() {
    try {
        const redirectUrl = AuthSession.makeRedirectUri({
            path: 'https://efhtpznenarzvbqbltuz.supabase.co/auth/v1/callback'
        });
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl,
            },
        });

        if (error) {
            console.error('Google Sign-In Error:', error.message);
            return { error: error.message };
        }
    
        return { data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error: 'Unexpected error during Google sign-in' };
    }
}

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    return { data, error };
}

export async function getSession() {
    const { data, error } = await supabase.auth.getSession();

    return { data, error };
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return { data, error };
}

export async function doesEmailExist(email: string): Promise<boolean | null> {
    const { data, error } = await supabase
      .rpc('is_email_exist', { email });
  
    if (error) {
      console.error('Error calling function:', error);
      return null;
    }
  
    return data;
  }