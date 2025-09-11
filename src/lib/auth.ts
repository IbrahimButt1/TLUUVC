"use server";

import { getSiteSettings } from "./site-settings";
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
    const { username, password } = Object.fromEntries(formData);
    const settings = await getSiteSettings();

    const isUsernameValid = username === settings.username;
    const isPasswordValid = password === settings.password;

    if (isUsernameValid && isPasswordValid) {
        // In a real app, you'd create a session here.
        // For this prototype, we'll just redirect.
        return redirect('/admin');
    } else {
        return 'Invalid username or password.';
    }
}
