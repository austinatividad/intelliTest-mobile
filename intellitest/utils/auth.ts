import { supabase } from "@/lib/supabase";
import * as AuthSession from 'expo-auth-session';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

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

async function convertImageToBase64(imageUri: string) {
    try {
      // Read the file at the given URI
      const base64String = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64String;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

export async function signUp(email: string, password: string, username: string, profile_pic_path: string) {
    //convert profile_pic to base64
    console.log(profile_pic_path);

    //get the last characters after the last dot
    const imageExtension = profile_pic_path.split('.').pop();
    console.log(imageExtension);

    //get the base64 string 
    //TODO
    const base64Str = await convertImageToBase64(profile_pic_path);

    const res = decode(base64Str || '');

    const { data: data3, error: error3 } = await supabase.storage.from('profile').upload(`public/${email}.${imageExtension}`, res);
    if (error3) {
        console.error('Error uploading profile picture:', error3.message);
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        console.error('Error during sign up:', error.message);
    }

    //get id from data
    const id = data?.user?.id;

    // add user to 'profile' table in public schema
    const { data: data2, error: error2 } = await supabase
        .from('profile')
        .insert([
            { id, email, username, profile_pic_path: `public/${email}.png` }
        ]);
    if (error2) {
        console.error('Error inserting into profile table:', error2.message);
    }

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


export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}


export async function getProfile(email: string) {
    const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('email', email)
        .single();

    return { data, error };
}