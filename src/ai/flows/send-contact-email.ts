'use server';
/**
 * @fileOverview A flow to send a contact email.
 *
 * - sendContactEmail - A function that handles sending an email from the contact form.
 * - SendContactEmailInput - The input type for the sendContactEmail function.
 * - SendContactEmailOutput - The return type for the sendContactEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';
import { ContactEmail } from '@/ai/emails/contact-email';

const resend = new Resend(process.env.RESEND_API_KEY);

const SendContactEmailInputSchema = z.object({
  name: z.string().describe('The name of the person sending the message.'),
  email: z.string().email().describe('The email address of the sender.'),
  subject: z.string().describe('The subject of the message.'),
  message: z.string().describe('The content of the message.'),
});
export type SendContactEmailInput = z.infer<typeof SendContactEmailInputSchema>;

const SendContactEmailOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
export type SendContactEmailOutput = z.infer<typeof SendContactEmailOutputSchema>;


export async function sendContactEmail(
  input: SendContactEmailInput
): Promise<SendContactEmailOutput> {
  return sendContactEmailFlow(input);
}

const sendContactEmailFlow = ai.defineFlow(
  {
    name: 'sendContactEmailFlow',
    inputSchema: SendContactEmailInputSchema,
    outputSchema: SendContactEmailOutputSchema,
  },
  async (input) => {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'bk1414551@gmail.com',
        subject: `New Contact Form Inquiry: ${input.subject}`,
        react: ContactEmail({
          name: input.name,
          email: input.email,
          message: input.message,
        }),
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: `Failed to send email. ${errorMessage}` };
    }
  }
);
