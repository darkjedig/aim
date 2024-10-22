"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { CreditCard, Lock, ShieldCheck, Check, Search, BarChart, Share2, ImageIcon } from 'lucide-react'
import { PricingAnimatedBackground } from '@/components/pricing-animated-background'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Session } from '@supabase/supabase-js'

interface Plan {
  id: number;
  name: string;
  credits: number;
  price: number;
  stripe_product_id: string;
  stripe_price_id: string;
  billing_cycle: 'monthly' | 'annual';
  features?: string[];
  gradient?: string;
}

interface CreditPricing {
  id: number;
  price_per_credit: number;
  stripe_product_id: string;
  stripe_price_id: string;
  title: string;
  features?: string[];
}

const gradients = [
  'from-blue-400 to-cyan-300',
  'from-purple-400 to-pink-300',
  'from-orange-400 to-red-300',
]

export default function PricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [creditAmount, setCreditAmount] = useState(100)
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()
  const [showAuthAlert, setShowAuthAlert] = useState<'subscribe' | 'credits' | null>(null)
  const [plans, setPlans] = useState<Plan[]>([]);
  const [session, setSession] = useState<Session | null>(null)
  const [creditPricing, setCreditPricing] = useState<CreditPricing | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('credits', { ascending: true });
      if (error) {
        console.error('Error fetching plans:', error);
      } else {
        const processedPlans = data.map((plan, index) => ({
          ...plan,
          name: plan.name.split(' ')[0], // Take only the first word of the name
          gradient: gradients[index % gradients.length], // Assign a gradient
        }));
        setPlans(processedPlans || []);
      }
    };

    fetchPlans();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsAuthenticated(!!session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsAuthenticated(!!session)
    })

    const fetchCreditPricing = async () => {
      const { data, error } = await supabase
        .from('credit_pricing')
        .select('*')
        .single();
      if (error) {
        console.error('Error fetching credit pricing:', error);
      } else {
        setCreditPricing(data);
      }
    };

    fetchCreditPricing();

    return () => subscription.unsubscribe()
  }, [])

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

  const handleSubscribe = async (priceId: string) => {
    if (!session) {
      setShowAuthAlert('subscribe')
      return
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else if (response.status === 401) {
        console.error('Authentication error:', data.error);
        setIsAuthenticated(false);
        setShowAuthAlert('subscribe');
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleBuyCredits = async () => {
    if (!session) {
      setShowAuthAlert('credits')
      return
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId: creditPricing?.stripe_price_id,
          quantity: creditAmount,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
          mode: 'payment', // Use 'payment' mode for one-time purchases
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <PricingAnimatedBackground />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
        <div className="flex justify-center items-center mb-8">
          <span className="mr-2">Monthly</span>
          <Switch
            checked={billingCycle === 'annual'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
          />
          <span className="ml-2">Annual (Save 20%)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.filter(plan => plan.billing_cycle === billingCycle).map((plan) => (
            <Card key={plan.id} className="bg-gray-800 border-purple-500/20 shadow-lg shadow-purple-500/10 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30">
              <CardHeader>
                <CardTitle className={`text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r ${plan.gradient}`}>
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-center text-gray-300">
                  {plan.credits} credits / {plan.billing_cycle === 'annual' ? 'year' : 'month'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <span className="text-4xl font-extrabold text-white">£{plan.price.toFixed(2)}</span>
                  <span className="text-gray-300">/{plan.billing_cycle === 'annual' ? 'yr' : 'mo'}</span>
                </div>
                {plan.features && (
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <Check className="h-5 w-5 text-purple-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleSubscribe(plan.stripe_price_id)}
                >
                  {isAuthenticated ? "Get Started" : "Sign Up to Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Credit-Only Option */}
        {creditPricing && (
          <Card className="mt-12 bg-gray-800 border-purple-500/20 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300">{creditPricing.title}</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Purchase credits without a subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <span className="text-4xl font-extrabold text-white">£{creditPricing.price_per_credit.toFixed(2)}</span>
                <span className="text-gray-300"> per credit</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Slider
                  value={[creditAmount]}
                  onValueChange={(value) => setCreditAmount(value[0])}
                  max={1000}
                  step={10}
                  className="w-64"
                />
                <span className="text-xl font-semibold text-white">{creditAmount} credits</span>
              </div>
              <p className="text-center text-gray-300 mt-4">
                Total: £{(creditAmount * creditPricing.price_per_credit).toFixed(2)}
              </p>
              {creditPricing.features && (
                <ul className="space-y-2 mt-4">
                  {creditPricing.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <Check className="h-5 w-5 text-purple-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleBuyCredits}
              >
                {isAuthenticated ? "Buy Credits" : "Sign Up to Buy Credits"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Our Tools Section */}
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

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-white hover:text-purple-400">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {showAuthAlert && (
          <Alert className="mt-4 bg-purple-500/20 border border-purple-500">
            <AlertDescription>
              Please <Link href="/sign-in" className="font-bold hover:underline">sign in</Link> or <Link href="/sign-up" className="font-bold hover:underline">create an account</Link> to {showAuthAlert === 'subscribe' ? 'subscribe' : 'buy credits'}.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
