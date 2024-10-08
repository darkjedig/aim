import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SubscriptionsAndCreditsProps {
  onAddPlan: () => void;
  onAddPackage: () => void;
}

export function SubscriptionsAndCredits({ onAddPlan, onAddPackage }: SubscriptionsAndCreditsProps) {
  const [subscriptionPlans] = useState([
    { id: 1, name: 'Basic', credits: 1000, price: 29.99 },
    { id: 2, name: 'Pro', credits: 5000, price: 99.99 },
  ])

  const [creditPackages] = useState([
    { id: 1, name: 'Small', credits: 500, price: 19.99 },
    { id: 2, name: 'Large', credits: 2000, price: 69.99 },
  ])

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableRow key={plan.id}>
                  <TableCell className="font-medium text-gray-300">{plan.name}</TableCell>
                  <TableCell className="text-gray-300">{plan.credits}</TableCell>
                  <TableCell className="text-gray-300">${plan.price}</TableCell>
                  <TableCell className="text-gray-300">
                    <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={onAddPlan}>Add New Plan</Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Credit Packages</CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium text-gray-300">{pkg.name}</TableCell>
                  <TableCell className="text-gray-300">{pkg.credits}</TableCell>
                  <TableCell className="text-gray-300">${pkg.price}</TableCell>
                  <TableCell className="text-gray-300">
                    <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={onAddPackage}>Add New Package</Button>
        </CardContent>
      </Card>
    </div>
  )
}