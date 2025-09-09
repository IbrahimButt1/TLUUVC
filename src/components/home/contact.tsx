'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useActionState, useState, useEffect } from "react";
import { sendContactEmail } from "@/ai/flows/send-contact-email";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getServices, type Service } from "@/lib/services";


type FormState = {
  success: boolean;
  message: string;
} | null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Send Inquiry
    </Button>
  );
}

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  const action = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    const emailValue = formData.get('email') as string;
    const phoneValue = formData.get('phone') as string;
    
    if (!emailValue && !phoneValue) {
        toast({
            title: "Validation Error",
            description: "Please provide either an email address or a phone number.",
            variant: "destructive",
        });
        return { success: false, message: "Email or phone is required." };
    }

    try {
      const result = await sendContactEmail({
        name: formData.get('name') as string,
        email: `${emailValue}${emailValue && phoneValue ? ' | ' : ''}${phoneValue}`,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      });

      if (result.success) {
        toast({
          title: "Inquiry Sent!",
          description: "Thank you for your message. We will get back to you shortly.",
        });
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        return { success: true, message: "Email sent successfully" };
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return { success: false, message: result.error! };
      }
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  const [state, formAction] = useActionState(action, null);

  return (
    <section id="contact" className="py-12 md:py-24 bg-background">
      <div className="container max-w-3xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Get in Touch</CardTitle>
            <CardDescription className="text-lg">
              Ready to start your journey? Fill out the form below for a personalized consultation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" action={formAction}>
               <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} />
                </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="john.doe@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select name="subject" value={subject} onValueChange={setSubject} required>
                    <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map((service) => (
                            <SelectItem key={service.id} value={service.title}>
                                {service.title}
                            </SelectItem>
                        ))}
                         <SelectItem value="Other">Other Inquiry</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea id="message" name="message" placeholder="Please describe your situation and questions." rows={6} required value={message} onChange={e => setMessage(e.target.value)} />
              </div>
              <div className="text-center">
                <SubmitButton />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
