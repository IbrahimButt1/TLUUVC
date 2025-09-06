'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2 } from 'lucide-react';
import { visaApplicationSummary, type VisaApplicationSummaryOutput } from '@/ai/flows/visa-application-summary';

type FormState = {
  summary: string;
  error?: string;
} | null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Get Summary
    </Button>
  );
}

export default function KnowledgeBase() {
  const [question, setQuestion] = useState('');

  const action = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    const question = formData.get('question') as string;
    if (!question || question.trim().length < 15) {
      return { summary: '', error: 'Please enter a more detailed question for a better summary.' };
    }
    
    try {
      const result: VisaApplicationSummaryOutput = await visaApplicationSummary({ question });
      return { summary: result.summary };
    } catch (e) {
      console.error(e);
      return { summary: '', error: 'An unexpected error occurred. Please try again later.' };
    }
  };
  
  const [state, formAction] = useFormState(action, null);

  return (
    <section id="knowledge" className="py-12 md:py-24 bg-secondary">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">AI Knowledge Base</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a common visa question? Get a quick summary from our AI-powered expert.
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form action={formAction}>
              <div className="grid w-full gap-4">
                <Textarea
                  name="question"
                  placeholder="e.g., What are the main requirements for a Canadian student visa for a citizen of India?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  required
                  aria-label="Visa question"
                />
                <div className="flex justify-end">
                  <SubmitButton />
                </div>
              </div>
            </form>
            
            {state?.error && <p className="mt-4 text-sm font-medium text-destructive">{state.error}</p>}
            
            {state?.summary && (
              <Card className="mt-6 bg-background">
                <CardHeader>
                  <div className="flex items-center">
                    <Lightbulb className="h-6 w-6 mr-3 text-accent" />
                    <CardTitle className="font-headline">AI-Generated Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{state.summary}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
