import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Ban, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: number;
  user_id: string;
  name: string;
  email: string;
  status: string;
  credits: number;
  last_login: string | null;
  account_level: 'customer' | 'admin';
}

function EditUserForm({ user, onSave, onCancel }: { user: User; onSave: (user: User) => void; onCancel: () => void }) {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: name === 'credits' ? Number(value) : value }));
  };

  const handleAccountLevelChange = (value: 'customer' | 'admin') => {
    setEditedUser(prev => ({ ...prev, account_level: value }));
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
        <Select onValueChange={handleAccountLevelChange} defaultValue={editedUser.account_level}>
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

function AddUserForm({ onSave, onCancel }: { onSave: (user: Omit<User, 'id' | 'user_id'> & { password: string }) => void; onCancel: () => void }) {
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'user_id'> & { password: string }>({
    name: '',
    email: '',
    password: '',
    status: 'Active',
    credits: 0,
    last_login: null,
    account_level: 'customer',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: name === 'credits' ? Number(value) : value }));
    // Clear the error for this field when it's changed
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAccountLevelChange = (value: 'customer' | 'admin') => {
    setNewUser(prev => ({ ...prev, account_level: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newUser.name) newErrors.name = 'Name is required';
    if (!newUser.email) newErrors.email = 'Email is required';
    if (!newUser.password) newErrors.password = 'Password is required';
    if (newUser.password && newUser.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>?]).{8,}/.test(newUser.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character';
    }
    if (newUser.credits < 0) newErrors.credits = 'Credits cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(newUser);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
        <Input 
          id="name"
          name="name" 
          value={newUser.name} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
        <Input 
          id="email"
          name="email" 
          type="email" 
          value={newUser.email} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
        <Input 
          id="password"
          name="password" 
          type="password"
          value={newUser.password} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-300">Status</label>
        <Input 
          id="status"
          name="status" 
          value={newUser.status} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
        {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="credits" className="text-sm font-medium text-gray-300">Credits</label>
        <Input 
          id="credits"
          name="credits" 
          type="number" 
          value={newUser.credits} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
        {errors.credits && <p className="text-red-500 text-xs">{errors.credits}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="accountLevel" className="text-sm font-medium text-gray-300">Account Level</label>
        <Select onValueChange={handleAccountLevelChange} defaultValue={newUser.account_level}>
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
          Create User
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="text-gray-800 border-gray-600 hover:bg-gray-300">
          Cancel
        </Button>
      </div>
    </form>
  );
}

const supabase = createClient();

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [addingUser, setAddingUser] = useState(false)
  const [banningUser, setBanningUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [addUserError, setAddUserError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('account_level')
          .eq('user_id', user.id)
          .single()

        console.log('Admin check result:', data, error)

        if (error) {
          console.error('Error checking admin status:', error)
          router.push('/')
        } else if (data?.account_level === 'admin') {
          setIsAdmin(true)
          fetchUsers()
        } else {
          console.log('User is not an admin')
          router.push('/')
        }
      } else {
        console.log('No user found')
        router.push('/login')
      }
      setIsLoading(false)
    }

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: false })
      if (error) {
        console.error('Error fetching users:', error)
      } else {
        console.log('Fetched users:', data)
        setUsers(data || [])
      }
    }

    checkAdminStatus()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div> // Or a more sophisticated loading indicator
  }

  if (!isAdmin) {
    return null // Or a message indicating lack of access
  }

  const handleSaveUser = async (editedUser: User) => {
    // Create a new object without the 'id' and 'user_id' fields
    const { id, user_id, ...updateData } = editedUser;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating user:', error);
    } else if (data) {
      setUsers((users) => users.map((user) => (user.id === id ? data[0] : user)));
      setEditingUser(null);
    }
  };

  const handleAddUser = async (newUser: Omit<User, 'id' | 'user_id'> & { password: string }) => {
    try {
      setAddUserError(null);
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            account_level: newUser.account_level,
          },
        },
      });

      if (error) throw error;

      if (data && data.user) {
        // The trigger will add the user to the public users table
        // Refresh the users list to include the new user
        const { data: updatedUsers, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .order('id', { ascending: false });
        
        if (fetchError) {
          console.error('Error fetching updated users:', fetchError);
        } else {
          setUsers(updatedUsers || []);
        }
        setAddingUser(false);
      } else {
        console.error('User creation successful but user data is missing');
        setAddUserError('User creation successful but user data is missing');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      if (error instanceof Error) {
        setAddUserError(error.message);
      } else {
        setAddUserError('An error occurred while adding the user');
      }
    }
  };

  const confirmBanUser = async () => {
    if (banningUser) {
      const updatedStatus = banningUser.status === 'Banned' ? 'Active' : 'Banned';
      const { error } = await supabase.from('users').update({ status: updatedStatus }).eq('id', banningUser.id);
      if (error) {
        console.error('Error updating user status:', error);
      } else {
        setUsers((users) =>
          users.map((user) => (user.id === banningUser.id ? { ...user, status: updatedStatus } : user))
        );
        setBanningUser(null);
      }
    }
  };

  const confirmDeleteUser = async () => {
    if (deletingUser) {
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(deletingUser.user_id);
        if (authError) throw authError;

        // The user will be automatically deleted from the users table due to the foreign key constraint
        setUsers((users) => users.filter((user) => user.id !== deletingUser.id));
        setDeletingUser(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        // Handle error (e.g., show error message to admin)
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleBanUser = (user: User) => {
    setBanningUser(user);
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
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
          <Button className="bg-purple-500 hover:bg-purple-600 text-white" onClick={() => setAddingUser(true)}>
            Add New User
          </Button>
        </div>
        {addingUser ? (
          <>
            {addUserError && <p className="text-red-500 mb-4">{addUserError}</p>}
            <AddUserForm onSave={handleAddUser} onCancel={() => setAddingUser(false)} />
          </>
        ) : editingUser ? (
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
                  <TableCell className="text-gray-300">
                    {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                  </TableCell>
                  <TableCell className="text-gray-300">{user.account_level}</TableCell>
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