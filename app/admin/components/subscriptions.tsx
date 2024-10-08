import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, plan: 'Basic', user: 'John Doe', status: 'Active', revenue: '$9.99' },
    { id: 2, plan: 'Pro', user: 'Jane Smith', status: 'Cancelled', revenue: '$19.99' },
    // Add more mock subscriptions as needed
  ])

  const [filter, setFilter] = useState('all')

  const filteredSubscriptions = filter === 'all' 
    ? subscriptions 
    : subscriptions.filter(sub => sub.status.toLowerCase() === filter)

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Subscriptions</h2>
      <div className="mt-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] mb-4">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.plan}</TableCell>
                <TableCell>{subscription.user}</TableCell>
                <TableCell>{subscription.status}</TableCell>
                <TableCell>{subscription.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}