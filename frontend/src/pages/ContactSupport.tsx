import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HeadphonesIcon, 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  Video,
  Shield,
  Loader2
} from 'lucide-react';

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    priority: 'medium',
    category: 'general',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual endpoint
      console.log('Support ticket submitted:', formData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically make an API call:
      // const response = await fetch('/api/support-tickets', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to submit ticket');
      // }

      setIsSubmitted(true);
      
      // Reset form after success message is shown
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          priority: 'medium',
          category: 'general',
          subject: '',
          message: ''
        });
        setErrors({});
      }, 5000);

    } catch (error) {
      console.error('Error submitting support ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const supportOptions = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@fleetguard.com",
      availability: "24/7"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "+1 (555) 123-4567",
      availability: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Real-time chat support",
      contact: "Available in dashboard",
      availability: "Mon-Fri 9AM-6PM EST"
    }
  ];

  const faqItems = [
    {
      question: "How do I upload videos to the system?",
      answer: "Navigate to the Video Clips section and click the upload button. You can drag and drop files or browse to select them.",
      category: "video"
    },
    {
      question: "What video formats are supported?",
      answer: "We support MP4, MOV, AVI, and WebM formats. Maximum file size is 500MB per video.",
      category: "video"
    },
    {
      question: "How are safety incidents detected?",
      answer: "Our AI analyzes video footage in real-time to detect behaviors like phone usage, texting, distracted driving, and more.",
      category: "safety"
    },
    {
      question: "Can I customize alert thresholds?",
      answer: "Yes, you can adjust sensitivity levels and create custom rules in the Settings section.",
      category: "alerts"
    },
    {
      question: "How do I add new vehicles to my fleet?",
      answer: "Go to Fleet Management and click 'Add Vehicle'. Fill in the vehicle details and assign drivers.",
      category: "fleet"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <HeadphonesIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Help & Support
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Get the help you need to make the most of FleetGuard. Our support team is here to assist you 24/7.
              </p>
            </div>

            {/* Support Options */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {supportOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                        {option.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">{option.availability}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {option.description}
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {option.contact}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Support Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                        Ticket Submitted Successfully!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Thank you for contacting us. We've received your support ticket and will get back to you within 24 hours.
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Ticket ID:</strong> #FL-{Date.now().toString().slice(-6)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={errors.name ? 'border-red-500' : ''}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@company.com"
                            className={errors.email ? 'border-red-500' : ''}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company Inc."
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="priority">Priority Level</Label>
                          <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="general">General Support</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing</option>
                            <option value="feature">Feature Request</option>
                            <option value="bug">Bug Report</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Brief description of your issue"
                          className={errors.subject ? 'border-red-500' : ''}
                        />
                        {errors.subject && (
                          <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          placeholder="Please provide detailed information about your issue or question..."
                          className={errors.message ? 'border-red-500' : ''}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting Ticket...
                          </>
                        ) : (
                          'Submit Support Ticket'
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Quick answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {faqItems.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {item.category === 'video' && <Video className="h-4 w-4 text-blue-600" />}
                            {item.category === 'safety' && <Shield className="h-4 w-4 text-green-600" />}
                            {item.category === 'alerts' && <AlertCircle className="h-4 w-4 text-orange-600" />}
                            {item.category === 'fleet' && <HelpCircle className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              {item.question}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Need More Help?
                      </h4>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Check out our comprehensive documentation and video tutorials for detailed guides on using FleetGuard.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Contact */}
            <Card className="mt-8 border-red-200 dark:border-red-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <CardTitle className="text-red-700 dark:text-red-400">Emergency Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 mb-2 font-semibold">
                    Critical System Issues or Safety Emergencies
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                    For urgent technical problems affecting fleet safety monitoring, call our emergency hotline immediately:
                  </p>
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="h-5 w-5 text-red-600" />
                    <span className="font-bold text-red-800 dark:text-red-200 text-lg">+1 (555) 911-HELP</span>
                    <Badge variant="destructive">24/7 Emergency</Badge>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    This line is reserved for critical emergencies only. For general support, please use the contact form above.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}