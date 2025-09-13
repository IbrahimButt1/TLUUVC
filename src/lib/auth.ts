
"use server";

import { getSiteSettings } from "./site-settings";
import { redirect } from 'next/navigation';
import { addLogEntry } from "./logs";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
    const { username, password, secretAnswer } = Object.fromEntries(formData);
    const settings = await getSiteSettings();

    // Handle secret answer for password recovery
    if (secretAnswer) {
        if (secretAnswer === settings.secretAnswer) {
             // In a real app, you'd create a session here.
             await addLogEntry('Successful Login', `User '${username || 'recovery user'}' logged in via password recovery.`);
            return redirect('/admin');
        } else {
            await addLogEntry('Failed Login', `Failed password recovery attempt.`);
            return 'Incorrect answer to the secret question.';
        }
    }

    // Standard username/password login
    const isUsernameValid = username === settings.username;
    const isPasswordValid = password === settings.password;

    if (isUsernameValid && isPasswordValid) {
        // In a real app, you'd create a session here.
        await addLogEntry('Successful Login', `User '${username}' logged in.`);
        return redirect('/admin');
    } else {
        await addLogEntry('Failed Login', `Failed login attempt for user '${username}'.`);
        return 'Invalid username or password.';
    }
}
