"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { CalInlineButton } from "@/components/cal-badge";
import { PersonalInfo } from "@/lib/data";

export default function ContactPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [contactInfo, setContactInfo] = useState<{
    email: string;
    calUsername: string;
    responseTime: string;
    availableForWork: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [personalResponse, contactResponse] = await Promise.all([
          fetch("/api/personal-info"),
          fetch("/api/contact-info"),
        ]);

        if (personalResponse.ok) {
          const personal = await personalResponse.json();
          setPersonalInfo(personal);
        }

        if (contactResponse.ok) {
          const contact = await contactResponse.json();
          setContactInfo(
            contact as {
              email: string;
              calUsername: string;
              responseTime: string;
              availableForWork: boolean;
            },
          );
        }
      } catch (error) {
        console.error("Error loading contact data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !personalInfo || !contactInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Send me an email anytime",
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Based in",
      value: personalInfo.location,
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-gradient mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have a project in mind or just want to chat? I&apos;d love to hear
            from you. Let&apos;s discuss how we can work together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Let&apos;s Connect
                </CardTitle>
                <CardDescription>
                  Choose your preferred way to reach out
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{method.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {method.description}
                        </p>
                        {method.href ? (
                          <a
                            href={method.href}
                            className="text-primary hover:underline text-sm"
                          >
                            {method.value}
                          </a>
                        ) : (
                          <span className="text-sm">{method.value}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Cal.com Booking */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Meeting</CardTitle>
                <CardDescription>
                  Book a 30-minute call to discuss your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalInlineButton calUsername={contactInfo.calUsername}>
                  Schedule a Call
                </CalInlineButton>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Response Time</h3>
              <p className="text-muted-foreground">
                I typically respond to emails within {contactInfo.responseTime}.
                For urgent matters, feel free to schedule a call using the
                booking system above.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
