"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { CreditCard, Lock, ShieldCheck, Check, Search, BarChart, Share2, ImageIcon } from 'lucide-react'
import { PricingAnimatedBackground } from '@/components/pricing-animated-background'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [creditAmount, setCreditAmount] = useState(100)

  const plans = [
    {
      name: 'Basic',
      gradient: 'from-blue-400 to-cyan-300',
      price: billingCycle === 'monthly' ? '£39.99' : '£399.90',
      credits: 600,
      features: ['Access to all basic tools', 'Email support', '5 team members', 'Cancel anytime', '14-day money-back guarantee'],
    },
    {
      name: 'Pro',
      gradient: 'from-purple-400 to-pink-300',
      price: billingCycle === 'monthly' ? '£99.99' : '£999.90',
      credits: 1800,
      features: ['Access to all pro tools', 'Priority email support', '10 team members', 'Advanced analytics', 'Cancel anytime', '14-day money-back guarantee'],
    },
    {
      name: 'Enterprise',
      gradient: 'from-orange-400 to-red-300',
      price: billingCycle === 'monthly' ? '£249.99' : '£2499.90',
      credits: 5500,
      features: ['Access to all enterprise tools', 'Dedicated account manager', 'Unlimited team members', 'Custom integrations', 'Cancel anytime', '14-day money-back guarantee'],
    },
  ]

  const tools = [
    { category: 'SEO Tools', items: ['Topic Finder', 'Strategy Builder', 'Blog Writer', 'Outrank', 'Internal Link Optimizer'], icon: Search },
    { category: 'PPC Tools', items: ['Keyword Finder', 'Headline Generator', 'Description Writer'], icon: BarChart },
    { category: 'Social Tools', items: ['Topic Finder', 'Post Builder', 'Post Scheduler'], icon: Share2 },
    { category: 'Creative Tools', items: ['Image Generator', 'BG Remover', 'Image Upscaler'], icon: ImageIcon },
  ]

  const faqItems = [
    {
      question: 'What are credits and how do they work?',
      answer: 'Credits are the currency used within the AIM platform to access and use various tools. Each tool usage consumes a certain number of credits. The number of credits you receive depends on your subscription tier.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be charged the prorated difference. If you downgrade, the new lower price will take effect at the start of the next billing cycle.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer a 14-day money-back guarantee for all new subscriptions. If you\'re not satisfied with our service, you can cancel within 14 days of your initial purchase for a full refund.'
    },
    {
      question: 'How does the credit-only option work?',
      answer: 'The credit-only option allows you to purchase credits without a subscription. You can buy a minimum of 100 credits for £5, and credits are priced at £0.05 per credit. These credits don\'t expire and can be used at any time.'
    },
  ]

  const toolDescriptions = [
    {
      category: 'SEO Tools',
      icon: Search,
      tools: [
        { name: 'Topic Finder', description: 'Discovers high-ranking topics and keywords for content strategy.' },
        { name: 'Strategy Builder', description: 'Helps create data-driven content strategies to boost online presence.' },
        { name: 'Blog Writer', description: 'AI-powered tool for generating SEO-optimized blog posts and articles.' },
        { name: 'Outrank', description: 'Analyzes and helps outperform competitors\' content.' },
        { name: 'Internal Link Optimizer', description: 'Improves site structure and boosts SEO with smart internal linking.' },
      ],
    },
    {
      category: 'PPC Tools',
      icon: BarChart,
      tools: [
        { name: 'Keyword Finder', description: 'Identifies valuable keywords for paid advertising campaigns.' },
        { name: 'Headline Generator', description: 'Creates compelling headlines for PPC ads.' },
        { name: 'Description Writer', description: 'Generates effective ad descriptions for PPC campaigns.' },
      ],
    },
    {
      category: 'Social Tools',
      icon: Share2,
      tools: [
        { name: 'Topic Finder', description: 'Identifies trending topics for social media content.' },
        { name: 'Post Builder', description: 'Assists in creating engaging social media posts.' },
        { name: 'Post Scheduler', description: 'Helps plan and schedule social media content across platforms.' },
      ],
    },
    {
      category: 'Creative Tools',
      icon: ImageIcon,
      tools: [
        { name: 'Image Generator', description: 'AI-powered tool for creating unique images for content and ads.' },
        { name: 'BG Remover', description: 'Automatically removes backgrounds from images.' },
        { name: 'Image Upscaler', description: 'Enhances and increases the resolution of images without losing quality.' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="relative h-[300px] overflow-hidden">
        <PricingAnimatedBackground />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Select the perfect plan for your marketing needs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-300">Monthly</span>
            <Switch
              checked={billingCycle === 'annual'}
              onCheckedChange={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            />
            <span className="text-sm font-medium text-gray-300">Annual (Save 20%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="bg-gray-800 border-purple-500/20 shadow-lg shadow-purple-500/10 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30">
              <CardHeader>
                <CardTitle className={`text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r ${plan.gradient}`}>
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-center text-gray-300">
                  {plan.credits} credits / {billingCycle === 'monthly' ? 'month' : 'year'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-300">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <Check className="h-5 w-5 text-purple-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Card className="bg-gray-800 border-purple-500/20 shadow-lg shadow-purple-500/10 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300">
                Credit-Only Option
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                Purchase credits without a subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white text-center mb-6">£0.05 <span className="text-xl font-normal text-gray-300">per credit</span></p>
              <div className="mt-6">
                <Slider
                  min={100}
                  max={10000}
                  step={100}
                  value={[creditAmount]}
                  onValueChange={(value) => setCreditAmount(value[0])}
                  className="w-full"
                />
                <p className="mt-4 text-gray-300 text-center">
                  {creditAmount} credits for £{(creditAmount * 0.05).toFixed(2)}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Buy Credits
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">Discover Our Powerful Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {toolDescriptions.map((category) => (
              <Card key={category.category} className="bg-gray-800 border-purple-500/20 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.tools.map((tool, index) => (
                      <AccordionItem key={index} value={`${category.category}-${index}`}>
                        <AccordionTrigger className="text-gray-300 hover:text-white">
                          {tool.name}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400">
                          {tool.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="max-w-2xl mx-auto">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-white">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-300">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">Need a Custom Solution?</h3>
          <p className="text-gray-300 mb-6">Contact our sales team for tailored enterprise solutions</p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Contact Sales
          </Button>
        </div>

        <div className="mt-16 flex justify-center space-x-8">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-300">Secure Payments</span>
          </div>
          <div className="flex items-center">
            <Lock className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-300">SSL Encrypted</span>
          </div>
          <div className="flex items-center">
            <ShieldCheck className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-300">14-Day Money-Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  )
}