import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from '@/utils/supabase/client'
import { cn } from "@/lib/utils"

const supabase = createClient()

interface SubscriptionsAndCreditsProps {
  onAddPlan: () => void;
}

interface Plan {
  id?: number;
  name: string;
  credits: number;
  price: number;
  stripe_product_id: string;
  stripe_price_id: string;
  billing_cycle: 'monthly' | 'annual';
  features?: string[];
}

interface CreditPricing {
  id: number;
  price_per_credit: number;
  stripe_product_id: string;
  stripe_price_id: string;
  title: string;
  features?: string[];
}

function EditForm({ item, onSave, onCancel, type }: { item: Plan | CreditPricing; onSave: (item: Plan | CreditPricing) => Promise<void>; onCancel: () => void; type: 'plan' | 'pricing' }) {
  const [editedItem, setEditedItem] = useState<Plan | CreditPricing>(item);
  const [features, setFeatures] = useState<string[]>((item as Plan).features || []);
  const [newFeature, setNewFeature] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'stripe_product_id' || name === 'stripe_price_id' || name === 'title'
        ? value
        : name === 'price_per_credit'
          ? parseFloat(value) || 0
          : Number(value)
    }));
  };

  const handleBillingCycleChange = (value: 'monthly' | 'annual') => {
    setEditedItem(prev => ({ ...prev, billing_cycle: value }));
  };

  const handleAddFeature = () => {
    if (newFeature) {
      setFeatures([...features, newFeature]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...editedItem, features } as Plan);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
      {type === 'plan' && (
        <>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
            <Input 
              id="name"
              name="name" 
              value={(editedItem as Plan).name} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="credits" className="text-sm font-medium text-gray-300">Credits</label>
            <Input 
              id="credits"
              name="credits" 
              type="number" 
              value={(editedItem as Plan).credits} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium text-gray-300">Price</label>
            <Input 
              id="price"
              name="price" 
              type="number" 
              step="0.01" 
              value={(editedItem as Plan).price} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="stripe_product_id" className="text-sm font-medium text-gray-300">Stripe Product ID</label>
            <Input 
              id="stripe_product_id"
              name="stripe_product_id" 
              value={(editedItem as Plan).stripe_product_id} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="stripe_price_id" className="text-sm font-medium text-gray-300">Stripe Price ID</label>
            <Input 
              id="stripe_price_id"
              name="stripe_price_id" 
              value={(editedItem as Plan).stripe_price_id} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="billing_cycle" className="text-sm font-medium text-gray-300">Billing Cycle</label>
            <Select onValueChange={handleBillingCycleChange} defaultValue={(editedItem as Plan).billing_cycle}>
              <SelectTrigger className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500">
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Features</label>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-gray-300">{feature}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFeature(index)} className="ml-2 text-red-500">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="New feature"
                className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
              />
              <Button type="button" onClick={handleAddFeature} className="bg-purple-500 hover:bg-purple-600 text-white">
                Add Feature
              </Button>
            </div>
          </div>
        </>
      )}
      {type === 'pricing' && (
        <>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-300">Title</label>
            <Input 
              id="title"
              name="title" 
              value={(editedItem as CreditPricing).title || ''} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="price_per_credit" className="text-sm font-medium text-gray-300">Price per Credit</label>
            <Input 
              id="price_per_credit"
              name="price_per_credit" 
              type="number" 
              step="0.0001" 
              value={(editedItem as CreditPricing).price_per_credit || 0} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="stripe_product_id" className="text-sm font-medium text-gray-300">Stripe Product ID</label>
            <Input 
              id="stripe_product_id"
              name="stripe_product_id" 
              value={(editedItem as CreditPricing).stripe_product_id} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="stripe_price_id" className="text-sm font-medium text-gray-300">Stripe Price ID</label>
            <Input 
              id="stripe_price_id"
              name="stripe_price_id" 
              value={(editedItem as CreditPricing).stripe_price_id} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Features</label>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-gray-300">{feature}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFeature(index)} className="ml-2 text-red-500">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="New feature"
                className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
              />
              <Button type="button" onClick={handleAddFeature} className="bg-purple-500 hover:bg-purple-600 text-white">
                Add Feature
              </Button>
            </div>
          </div>
        </>
      )}
      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
          Save {type === 'plan' ? 'Plan' : 'Pricing'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="text-gray-800 border-gray-600 hover:bg-gray-300">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function SubscriptionsAndCredits({ onAddPlan }: SubscriptionsAndCreditsProps) {
  const [subscriptionPlans, setSubscriptionPlans] = useState<Plan[]>([]);
  const [creditPricing, setCreditPricing] = useState<CreditPricing | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingPricing, setEditingPricing] = useState<CreditPricing | null>(null);
  const [addingPlan, setAddingPlan] = useState(false);

  useEffect(() => {
    fetchSubscriptionPlans();
    fetchCreditPricing();
  }, []);

  const fetchSubscriptionPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('credits', { ascending: true });
    if (error) {
      console.error('Error fetching subscription plans:', error);
    } else {
      setSubscriptionPlans(data || []);
    }
  };

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

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const handleEditPricing = () => {
    if (creditPricing) {
      setEditingPricing(creditPricing);
    }
  };

  const handleSavePlan = async (editedItem: Plan | CreditPricing) => {
    if ('name' in editedItem) {  // Type guard to ensure it's a Plan
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(editedItem)
        .eq('id', editedItem.id)
        .select();
      if (error) {
        console.error('Error updating plan:', error);
      } else if (data) {
        setSubscriptionPlans(plans => plans.map(plan => plan.id === editedItem.id ? data[0] : plan));
        setEditingPlan(null);
      }
    }
  };

  const handleSavePricing = async (editedPricing: CreditPricing) => {
    const { data, error } = await supabase
      .from('credit_pricing')
      .update(editedPricing)
      .eq('id', editedPricing.id)
      .select();

    if (error) {
      console.error('Error updating credit pricing:', error);
    } else if (data) {
      setCreditPricing(data[0]);
      setEditingPricing(null);
    }
  };

  const handleAddPlan = async (newPlan: Omit<Plan, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([newPlan])
        .select();

      if (error) throw error;

      if (data) {
        setSubscriptionPlans([...subscriptionPlans, data[0]]);
        setAddingPlan(false);
      }
    } catch (error) {
      console.error('Error adding new plan:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Subscription Plans Card */}
      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Subscriptions and Credit Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          {editingPlan ? (
            <EditForm 
              item={editingPlan} 
              onSave={(item) => handleSavePlan(item as Plan)} 
              onCancel={() => setEditingPlan(null)} 
              type="plan" 
            />
          ) : addingPlan ? (
            <EditForm 
              item={{
                name: '',
                credits: 0,
                price: 0,
                stripe_product_id: '',
                stripe_price_id: '',
                billing_cycle: 'monthly',
              } as Plan} // Cast as Plan to satisfy the type checker
              onSave={(item) => handleAddPlan(item as Omit<Plan, 'id'>)}
              onCancel={() => setAddingPlan(false)}
              type="plan"
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-700 hover:bg-purple-500/20 transition-colors">
                    <TableHead className="text-gray-100">Plan Name</TableHead>
                    <TableHead className="text-gray-100">Credits</TableHead>
                    <TableHead className="text-gray-100">Price (£)</TableHead>
                    <TableHead className="text-gray-100">Billing Cycle</TableHead>
                    <TableHead className="text-gray-100">Stripe Product ID</TableHead>
                    <TableHead className="text-gray-100">Stripe Price ID</TableHead>
                    <TableHead className="text-gray-100">Features</TableHead>
                    <TableHead className="text-gray-100">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionPlans.map((plan) => (
                    <TableRow 
                      key={plan.id}
                      className={cn(
                        "transition-colors hover:bg-purple-500/10",
                      )}
                    >
                      <TableCell className="font-medium text-gray-300">{plan.name}</TableCell>
                      <TableCell className="text-gray-300">{plan.credits}</TableCell>
                      <TableCell className="text-gray-300">£{plan.price.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-300">{plan.billing_cycle}</TableCell>
                      <TableCell className="text-gray-300">{plan.stripe_product_id}</TableCell>
                      <TableCell className="text-gray-300">{plan.stripe_price_id}</TableCell>
                      <TableCell className="text-gray-300">
                        {plan.features?.length || 0} features
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white" onClick={() => handleEditPlan(plan)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={() => setAddingPlan(true)}>Add New Plan</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Credit Pricing Card */}
      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Credit Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          {editingPricing ? (
            <EditForm 
              item={editingPricing} 
              onSave={(item) => handleSavePricing(item as CreditPricing)} 
              onCancel={() => setEditingPricing(null)} 
              type="pricing" 
            />
          ) : creditPricing ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-700 hover:bg-purple-500/20 transition-colors">
                  <TableHead className="text-gray-100">Title</TableHead>
                  <TableHead className="text-gray-100">Price per Credit</TableHead>
                  <TableHead className="text-gray-100">Stripe Product ID</TableHead>
                  <TableHead className="text-gray-100">Stripe Price ID</TableHead>
                  <TableHead className="text-gray-100">Features</TableHead>
                  <TableHead className="text-gray-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="transition-colors hover:bg-purple-500/10">
                  <TableCell className="font-medium text-gray-300">{creditPricing.title}</TableCell>
                  <TableCell className="text-gray-300">£{creditPricing.price_per_credit.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-300">{creditPricing.stripe_product_id}</TableCell>
                  <TableCell className="text-gray-300">{creditPricing.stripe_price_id}</TableCell>
                  <TableCell className="text-gray-300">
                    {creditPricing.features?.length || 0} features
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white" onClick={() => setEditingPricing(creditPricing)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-300">No credit pricing found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
