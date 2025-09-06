'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would handle form submission to a backend here.
    toast({
      title: "Inquiry Sent!",
      description: "Thank you for your message. We will get back to you shortly.",
    });
    e.currentTarget.reset();
  };

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
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="e.g., Inquiry about Student Visa" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea id="message" name="message" placeholder="Please describe your situation and questions." rows={6} required />
              </div>
              <div className="text-center">
                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Send Inquiry
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
