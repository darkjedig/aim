import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from '@/utils/supabase/client'
import { cn } from "@/lib/utils"

const supabase = createClient()

interface SubscriptionsAndCreditsProps {
  onAddPlan: () => void;
}

interface Plan {
  id: number;
  name: string;
  credits: number;
  price: number;
}

interface CreditPricing {
  id: number;
  price_per_credit: number;
}

function EditForm({ item, onSave, onCancel, type }: { item: Plan | CreditPricing; onSave: (item: Plan | CreditPricing) => Promise<void>; onCancel: () => void; type: 'plan' | 'pricing' }) {
  const [editedItem, setEditedItem] = useState(item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({ ...prev, [name]: name === 'name' ? value : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedItem);
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
        </>
      )}
      {type === 'pricing' && (
        <div className="space-y-2">
          <label htmlFor="price_per_credit" className="text-sm font-medium text-gray-300">Price per Credit</label>
          <Input 
            id="price_per_credit"
            name="price_per_credit" 
            type="number" 
            step="0.0001" 
            value={(editedItem as CreditPricing).price_per_credit} 
            onChange={handleChange} 
            className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
          />
        </div>
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
        
        // Update users' subscription column
        const { error: updateError } = await supabase
          .from('users')
          .update({ subscription: editedItem.name })
          .eq('subscription', editedItem.name);
        
        if (updateError) {
          console.error('Error updating users\' subscriptions:', updateError);
        }
      }
    }
  };

  const handleSavePricing = async (editedItem: Plan | CreditPricing) => {
    if ('price_per_credit' in editedItem) {  // Type guard to ensure it's a CreditPricing
      const { data, error } = await supabase
        .from('credit_pricing')
        .update(editedItem)
        .eq('id', editedItem.id)
        .select();
      if (error) {
        console.error('Error updating credit pricing:', error);
      } else if (data) {
        setCreditPricing(data[0]);
        setEditingPricing(null);
      }
    }
  };

  return (
    <div className="space-y-8">
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
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-700 hover:bg-purple-500/20 transition-colors">
                    <TableHead className="text-gray-100">Plan Name</TableHead>
                    <TableHead className="text-gray-100">Monthly Credits</TableHead>
                    <TableHead className="text-gray-100">Price (£)</TableHead>
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
                      <TableCell className="text-gray-300">
                        <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white" onClick={() => handleEditPlan(plan)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={onAddPlan}>Add New Plan</Button>
            </>
          )}
        </CardContent>
      </Card>

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
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-700 hover:bg-purple-500/20 transition-colors">
                    <TableHead className="text-gray-100">Price per Credit (£)</TableHead>
                    <TableHead className="text-gray-100">Minimum Purchase</TableHead>
                    <TableHead className="text-gray-100">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditPricing && (
                    <TableRow className="transition-colors hover:bg-purple-500/10">
                      <TableCell className="font-medium text-gray-300">£{creditPricing.price_per_credit.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-300">100 credits for £5</TableCell>
                      <TableCell className="text-gray-300">
                        <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white" onClick={handleEditPricing}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}