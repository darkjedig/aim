import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Wrench, TrendingUp } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

// Mock data (replace with actual data fetching logic)
const mockData = {
  totalUsers: 5000,
  monthlyRevenue: 50000,
  totalCreditsConsumed: 100000,
  topTools: ['SEO Topic Finder', 'AI Content Writer', 'Strategy Builder'],
  usageData: [
    { name: 'Jan', usage: 4000 },
    { name: 'Feb', usage: 3000 },
    { name: 'Mar', usage: 5000 },
    { name: 'Apr', usage: 4500 },
    { name: 'May', usage: 6000 },
    { name: 'Jun', usage: 5500 },
  ],
}

export function Overview() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">{mockData.totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">${mockData.monthlyRevenue}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Credits Consumed</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">{mockData.totalCreditsConsumed}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Top Tools</CardTitle>
            <Wrench className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-300">
              {mockData.topTools.map((tool, index) => (
                <li key={index}>{tool}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-gray-100">Tool Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Line type="monotone" dataKey="usage" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}