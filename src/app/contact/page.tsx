"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    // console.log("Form submitted:", formData)
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({ name: "", email: "", subject: "", category: "", message: "" })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We&apos;d love to hear from you. Reach out and we&apos;ll respond as soon
            as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <p className="text-gray-600 dark:text-gray-300">support@quizmaster.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                    <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Address</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Education Street
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Business Hours</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 9:00 AM - 6:00 PM PST
                      <br />
                      Saturday: 10:00 AM - 4:00 PM PST
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Support</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>
                      <a href="/help" className="hover:text-primary transition-colors">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="/tutorials" className="hover:text-primary transition-colors">
                        Video Tutorials
                      </a>
                    </li>
                    <li>
                      <a href="/faq" className="hover:text-primary transition-colors">
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resources</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>
                      <a href="/blog" className="hover:text-primary transition-colors">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="/templates" className="hover:text-primary transition-colors">
                        Quiz Templates
                      </a>
                    </li>
                    <li>
                      <a href="/api" className="hover:text-primary transition-colors">
                        API Documentation
                      </a>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How do I get started with QuizMaster?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Simply sign up for a free account and start creating your first quiz. Our intuitive interface makes it
                  easy to get started in minutes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I customize the appearance of my quizzes?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yes! You can customize colors, fonts, and layouts to match your brand or personal preferences with our
                  theme customization options.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Is there a limit to how many quizzes I can create?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Free accounts can create up to 5 quizzes. Premium plans offer unlimited quiz creation along with
                  advanced features and analytics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How do I share my quizzes with others?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  You can share quizzes via direct links, embed them on websites, or share on social media platforms
                  with our built-in sharing tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
