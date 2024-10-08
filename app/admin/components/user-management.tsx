import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Ban } from "lucide-react"

interface UserManagementProps {
  onAddUser: () => void;
}

export function UserManagement({ onAddUser }: UserManagementProps) {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', credits: 500, lastLogin: '2023-09-28' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', credits: 0, lastLogin: '2023-08-15' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', credits: 250, lastLogin: '2023-09-27' },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-gray-700 text-gray-300 border-gray-600"
          />
          <Button className="bg-purple-500 hover:bg-purple-600 text-white" onClick={onAddUser}>Add New User</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Credits</TableHead>
              <TableHead className="text-gray-300">Last Login</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-gray-300">{user.name}</TableCell>
                <TableCell className="text-gray-300">{user.email}</TableCell>
                <TableCell className="text-gray-300">{user.status}</TableCell>
                <TableCell className="text-gray-300">{user.credits}</TableCell>
                <TableCell className="text-gray-300">{user.lastLogin}</TableCell>
                <TableCell className="text-gray-300">
                  <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white mr-2">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-red-500 hover:text-white">
                    <Ban className="h-4 w-4 mr-1" />
                    Ban
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}