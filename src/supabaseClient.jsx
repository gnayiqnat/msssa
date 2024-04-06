import { createClient } from '@supabase/supabase-js';
import { enqueueSnackbar } from 'notistack';

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_KEY;

let supabase = 'fo1';
supabase == 'fo1' && (supabase = createClient(supabaseUrl, supabaseKey));

export async function checkIfSignedIn() {
    let returnThis;
    await supabase.auth.getSession().then((r) => {
        r.data
            ? r.data.session == null
                ? (returnThis = false)
                : (returnThis = true)
            : console.log(r);
    });
    return returnThis && returnThis;
}

export async function getEmail() {
    let returnThis = 'nothin';

    await supabase.auth.getUser().then((response) => {
        response.data.user.email
            ? (returnThis = response.data.user.email)
            : console.log(response);
    });
    return returnThis !== 'nothin' && returnThis;
}

export async function getUsername() {
    try {
        const { data, error } = await supabase.from('usernames').select('*');

        if (error) throw error;

        return data; // Return the fetched data
    } catch (error) {
        console.error('Error fetching username:', error);
        return null; // Or return something that indicates an error
    }
}

export async function setUsername(newUsername) {
    const email = getEmail();

    const { data, error, status, statusText } = await supabase
        .from('usernames')
        .insert([{ username: newUsername, email: email }])
        .select();

    if (error) {
        // Handle error
        enqueueSnackbar(error.message, {
            variant: 'error',
            preventDuplicate: true,
        });
        return { success: false, message: error.message };
    }

    // Data successfully inserted
    return { success: true, status, statusText };
}

export async function setPassword(newPassword) {
    let response = 'nothin';
    await supabase.auth.updateUser({ password: newPassword }).then((r) => {
        response = r;
    });

    return response !== 'nothin' && response;
}
export function signIn(CEV, CPV) {
    return new Promise((resolve, reject) => {
        let status = 'NOTHING:(';
        supabase.auth
            .signInWithPassword({
                email: CEV,
                password: CPV,
            })
            .then((response) => {
                if (response.data.user) {
                    status = true;
                    resolve(status);
                } else {
                    enqueueSnackbar(response.error.message, {
                        variant: 'error',
                        preventDuplicate: true,
                    });
                    status = response.error.message;
                    reject(status);
                }
            })
            .catch((error) => {
                // Handle other errors
                enqueueSnackbar(error.message, {
                    variant: 'error',
                    preventDuplicate: true,
                });
                reject(error.message);
            });
    });
}

export async function logOut() {
    try {
        await supabase.auth.signOut();
        console.log('User signed out successfully');
        enqueueSnackbar('Log out success', {
            variant: 'success',
            preventDuplicate: true,
        });
    } catch (error) {
        console.error('Error during sign out:', error);
        enqueueSnackbar(
            'An error has occurred during sign out. Please try again later.',
            { variant: 'error', preventDuplicate: true }
        );
    }
}
export async function LogSignInTime(username) {
    const currentTime = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  
    try {
      // 1. Client-side check for existing sessions
      const { data: existingSessions, error: fetchError } = await supabase
        .from('user_sessions')
        .select('sign_out_time') 
        .eq('username', username) 
        .eq('sign_out_time', ''); // Check for empty string
  
      if (fetchError) throw fetchError;
  
      if (existingSessions.length > 0) {
        console.error('User already has an active session'); 
        return 'You already have an active session. Please sign out first.';
      }
  
      // Check passed, create a new session
      const { data: newData, error: newError } = await supabase
        .from('user_sessions')
        .insert([{ username: username, sign_in_time: currentTime }]);
  
      if (newError) throw newError;
      console.log('Sign-in time logged');
    } catch (error) {
      console.error('Error logging sign-in time:', error);
      return 'Something went wrong. Please check console for more information.';
    }
  }
  
export async function UpdateLogOutTime() {
    const currentTime = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

    try {
        const { data, error } = await supabase
            .from('user_sessions')
            .update({ sign_out_time: currentTime })
            .eq('sign_out_time', '')
            .select();

        if (error) {
            console.error('Error updating sign-out time:', error); // Log the complete error object
            throw error;
        }
    } catch (error) {
        console.error('Error in UpdateLogOutTime:', error);
    }
}

// ... Other Components - Example Usage

export async function handleSignOut() {
    await UpdateLogOutTime();
    await logOut();
}
