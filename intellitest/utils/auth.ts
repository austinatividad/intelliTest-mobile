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