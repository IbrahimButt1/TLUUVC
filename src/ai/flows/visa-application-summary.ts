'use server';

/**
 * @fileOverview Provides a summary of visa application requirements based on user questions.
 *
 * - visaApplicationSummary - A function that takes a question about a visa application and returns a summary of the requirements.
 * - VisaApplicationSummaryInput - The input type for the visaApplicationSummary function.
 * - VisaApplicationSummaryOutput - The return type for the visaApplicationSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisaApplicationSummaryInputSchema = z.object({
  question: z
    .string()
    .describe('The question about visa application requirements.'),
});
export type VisaApplicationSummaryInput = z.infer<
  typeof VisaApplicationSummaryInputSchema
>;

const VisaApplicationSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the visa application requirements.'),
});
export type VisaApplicationSummaryOutput = z.infer<
  typeof VisaApplicationSummaryOutputSchema
>;

export async function visaApplicationSummary(
  input: VisaApplicationSummaryInput
): Promise<VisaApplicationSummaryOutput> {
  return visaApplicationSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visaApplicationSummaryPrompt',
  input: {schema: VisaApplicationSummaryInputSchema},
  output: {schema: VisaApplicationSummaryOutputSchema},
  prompt: `You are an expert visa consultant. Please provide a concise summary of the visa application requirements based on the user's question.\n\nQuestion: {{{question}}}`,
});

const visaApplicationSummaryFlow = ai.defineFlow(
  {
    name: 'visaApplicationSummaryFlow',
    inputSchema: VisaApplicationSummaryInputSchema,
    outputSchema: VisaApplicationSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
