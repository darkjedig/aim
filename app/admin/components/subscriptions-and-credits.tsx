import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SubscriptionsAndCreditsProps {
  onAddPlan: () => void;
  onAddPackage: () => void;
}

interface Plan {
  id: number;
  name: string;
  credits: number;
  price: number;
}

interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  price: number;
}

function EditForm({ item, onSave, onCancel, type }: { item: Plan | CreditPackage; onSave: (item: Plan | CreditPackage) => void; onCancel: () => void; type: 'plan' | 'package' }) {
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
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
        <Input 
          id="name"
          name="name" 
          value={editedItem.name} 
          onChange={handleChange} 
          placeholder="Name" 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="credits" className="text-sm font-medium text-gray-300">Credits</label>
        <Input 
          id="credits"
          name="credits" 
          type="number" 
          value={editedItem.credits} 
          onChange={handleChange} 
          placeholder="Credits" 
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
          value={editedItem.price} 
          onChange={handleChange} 
          placeholder="Price" 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
      </div>
      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
          Save {type === 'plan' ? 'Plan' : 'Package'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="text-gray-800 border-gray-600 hover:bg-gray-300">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function SubscriptionsAndCredits({ onAddPlan, onAddPackage }: SubscriptionsAndCreditsProps) {
  const [subscriptionPlans, setSubscriptionPlans] = useState<Plan[]>([
    { id: 1, name: 'Basic', credits: 1000, price: 29.99 },
    { id: 2, name: 'Pro', credits: 5000, price: 99.99 },
  ]);

  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([
    { id: 1, name: 'Small', credits: 500, price: 19.99 },
    { id: 2, name: 'Large', credits: 2000, price: 69.99 },
  ]);

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const handleEditPackage = (pkg: CreditPackage) => {
    setEditingPackage(pkg);
  };

  const handleSavePlan = (editedPlan: Plan) => {
    setSubscriptionPlans(plans => plans.map(plan => plan.id === editedPlan.id ? editedPlan : plan));
    setEditingPlan(null);
  };

  const handleSavePackage = (editedPackage: CreditPackage) => {
    setCreditPackages(packages => packages.map(pkg => pkg.id === editedPackage.id ? editedPackage : pkg));
    setEditingPackage(null);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {editingPlan ? (
            <EditForm item={editingPlan} onSave={handleSavePlan} onCancel={() => setEditingPlan(null)} type="plan" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Plan Name</TableHead>
                    <TableHead className="text-gray-300">Monthly Credits</TableHead>
                    <TableHead className="text-gray-300">Price</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionPlans.map((plan) => (
                    <TableRow 
                      key={plan.id}
                      className={cn(
                        "transition-colors hover:bg-purple-500/10",
                        "data-[state=selected]:bg-purple-500/20"
                      )}
                    >
                      <TableCell className="font-medium text-gray-300">{plan.name}</TableCell>
                      <TableCell className="text-gray-300">{plan.credits}</TableCell>
                      <TableCell className="text-gray-300">${plan.price}</TableCell>
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
          <CardTitle className="text-2xl font-bold text-white">Credit Packages</CardTitle>
        </CardHeader>
        <CardContent>
          {editingPackage ? (
            <EditForm item={editingPackage} onSave={handleSavePackage} onCancel={() => setEditingPackage(null)} type="package" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Package Name</TableHead>
                    <TableHead className="text-gray-300">Credits</TableHead>
                    <TableHead className="text-gray-300">Price</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditPackages.map((pkg) => (
                    <TableRow 
                      key={pkg.id}
                      className={cn(
                        "transition-colors hover:bg-purple-500/10",
                        "data-[state=selected]:bg-purple-500/20"
                      )}
                    >
                      <TableCell className="font-medium text-gray-300">{pkg.name}</TableCell>
                      <TableCell className="text-gray-300">{pkg.credits}</TableCell>
                      <TableCell className="text-gray-300">${pkg.price}</TableCell>
                      <TableCell className="text-gray-300">
                        <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white" onClick={() => handleEditPackage(pkg)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={onAddPackage}>Add New Package</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}