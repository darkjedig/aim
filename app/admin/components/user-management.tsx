import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Ban, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserManagementProps {
  onAddUser: () => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  credits: number;
  lastLogin: string;
  accountLevel: 'customer' | 'admin';
}

function EditUserForm({ user, onSave, onCancel }: { user: User; onSave: (user: User) => void; onCancel: () => void }) {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: name === 'credits' ? Number(value) : value }));
  };

  const handleAccountLevelChange = (value: 'customer' | 'admin') => {
    setEditedUser(prev => ({ ...prev, accountLevel: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
        <Input 
          id="name"
          name="name" 
          value={editedUser.name} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
        <Input 
          id="email"
          name="email" 
          type="email" 
          value={editedUser.email} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-300">Status</label>
        <Input 
          id="status"
          name="status" 
          value={editedUser.status} 
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
          value={editedUser.credits} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="accountLevel" className="text-sm font-medium text-gray-300">Account Level</label>
        <Select onValueChange={handleAccountLevelChange} defaultValue={editedUser.accountLevel}>
          <SelectTrigger className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="Select account level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
          Save User
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="text-gray-800 border-gray-600 hover:bg-gray-300">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function UserManagement({ onAddUser }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', credits: 500, lastLogin: '2023-09-28', accountLevel: 'customer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', credits: 0, lastLogin: '2023-08-15', accountLevel: 'customer' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Banned', credits: 250, lastLogin: '2023-09-27', accountLevel: 'admin' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [banningUser, setBanningUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveUser = (editedUser: User) => {
    setUsers(users => users.map(user => user.id === editedUser.id ? editedUser : user));
    setEditingUser(null);
  };

  const handleBanUser = (user: User) => {
    setBanningUser(user);
  };

  const confirmBanUser = () => {
    if (banningUser) {
      setUsers(users => users.map(user => 
        user.id === banningUser.id ? { ...user, status: user.status === 'Banned' ? 'Active' : 'Banned' } : user
      ));
      setBanningUser(null);
    }
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
  };

  const confirmDeleteUser = () => {
    if (deletingUser) {
      setUsers(users => users.filter(user => user.id !== deletingUser.id));
      setDeletingUser(null);
    }
  };

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
        {editingUser ? (
          <EditUserForm user={editingUser} onSave={handleSaveUser} onCancel={() => setEditingUser(null)} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Credits</TableHead>
                <TableHead className="text-gray-300">Last Login</TableHead>
                <TableHead className="text-gray-300">Account Level</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id}
                  className={cn(
                    "transition-colors hover:bg-purple-500/10",
                    "data-[state=selected]:bg-purple-500/20"
                  )}
                >
                  <TableCell className="font-medium text-gray-300">{user.name}</TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell className="text-gray-300">{user.status}</TableCell>
                  <TableCell className="text-gray-300">{user.credits}</TableCell>
                  <TableCell className="text-gray-300">{user.lastLogin}</TableCell>
                  <TableCell className="text-gray-300">{user.accountLevel}</TableCell>
                  <TableCell className="text-gray-300">
                    <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white mr-2" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`hover:${user.status === 'Banned' ? 'bg-green-500' : 'bg-red-500'} hover:text-white mr-2`} 
                      onClick={() => handleBanUser(user)}
                    >
                      <Ban className="h-4 w-4 mr-1" />
                      {user.status === 'Banned' ? 'Unban' : 'Ban'}
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-red-500 hover:text-white" onClick={() => handleDeleteUser(user)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <Dialog open={banningUser !== null} onOpenChange={() => setBanningUser(null)}>
        <DialogContent className="bg-gray-800 text-gray-300">
          <DialogHeader>
            <DialogTitle>{banningUser?.status === 'Banned' ? 'Unban' : 'Ban'} User</DialogTitle>
            <DialogDescription>
              Are you sure you want to {banningUser?.status === 'Banned' ? 'unban' : 'ban'} {banningUser?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanningUser(null)} className="text-gray-800 border-gray-600 hover:bg-gray-300">
              Cancel
            </Button>
            <Button onClick={confirmBanUser} className={`${banningUser?.status === 'Banned' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}>
              Confirm {banningUser?.status === 'Banned' ? 'Unban' : 'Ban'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deletingUser !== null} onOpenChange={() => setDeletingUser(null)}>
        <DialogContent className="bg-gray-800 text-gray-300">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)} className="text-gray-800 border-gray-600 hover:bg-gray-300">
              Cancel
            </Button>
            <Button onClick={confirmDeleteUser} className="bg-red-500 hover:bg-red-600 text-white">
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}