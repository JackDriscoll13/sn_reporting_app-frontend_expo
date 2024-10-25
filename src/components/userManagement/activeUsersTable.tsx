import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa'; // Import icons
import { backendUrl } from '../../config';


type ActiveUser = { 
    email: string;
    role: string; 
    team: string;
    last_login_time: string; 
}

interface ActiveUsersTableProps {
    userContextEmail: string | null;
  }

const ActiveUsersTable: React.FC<ActiveUsersTableProps> = ({ userContextEmail }) => {
    const [users, setUsers] = useState<ActiveUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'last_login_time', desc: true } // Initial sort state
      ]);

    // Modal for editing user role
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<ActiveUser | null>(null);
    const [newRole, setNewRole] = useState<string>('');
    const [isLoadingModal, setIsLoadingModal] = useState(false);

    // Modal for deleting user
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<ActiveUser | null>(null);
    const [isLoadingDeleteModal, setIsLoadingDeleteModal] = useState(false);

    const columnHelper = createColumnHelper<ActiveUser>();

    const columns = useMemo(
      () => [
        columnHelper.accessor("email", {
          header: "Email",
          cell: (info) => info.getValue(),
          sortingFn: "alphanumeric", 
          meta: { className: "w-1/3" }
        }),
        columnHelper.accessor("role", {
          header: "Role",
          cell: (info) => info.getValue(),
          sortingFn: "alphanumeric",
          meta: { className: "w-1/3" }
        }),
        columnHelper.accessor("team", {
          header: "Team",
          cell: (info) => info.getValue(),
          sortingFn: "alphanumeric",
          meta: { className: "w-1/3" }
        }),
        columnHelper.accessor("last_login_time", {
          header: "Last Login",
          cell: (info) => info.getValue(),
          sortingFn: (a, b) => {
            return new Date(a.original.last_login_time).getTime() - new Date(b.original.last_login_time).getTime();
          },
          meta: { className: "w-1/3" }
        }),
        columnHelper.display({
          id: 'actions',
          header: () => null,
          cell: (info) => {
            const user = info.row.original;
            const canModify = user.role === 'user' || (user.role === 'admin' && user.email === userContextEmail);
            
            return (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => canModify && handleEdit(user)}
                  className={`${canModify ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'} transition-colors duration-200`}
                  title={canModify ? 'Edit user' : "You can't edit permissions for admins who are not you."}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => canModify && handleDelete(user)}
                  className={`${canModify ? 'text-red-600 hover:text-red-800' : 'text-gray-400'} transition-colors duration-200`}
                  title={canModify ? 'Delete user' : "You can't delete admins who are not you."}
                >
                  <FaTrash />
                </button>
              </div>
            );
          },
          enableSorting: false, // Disable sorting for this column
          meta: { className: "w-1/6" }
        }),
      ],
      [userContextEmail]
    );

    const table = useReactTable({
      data: users,
      columns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    const fetchUsers = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/useradmin/get_current_users`);
          if (!response.ok) {
            throw new Error('Failed to fetch active users');
          }
          const responseData = await response.json();
          setUsers(responseData.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch active users');
          setLoading(false);
        }
      };


    useEffect(() => {
        fetchUsers();
      }, []);

      const handleEdit = (user: ActiveUser) => {
        setEditingUser(user);
        setNewRole(user.role);
        setIsEditModalOpen(true);
      };
  
      const handleDelete = (user: ActiveUser) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

      const handleRoleChange = async (userId: string, newRole: string, oldRole: string) => {
        console.log('Updating role for user:', userId, 'New role:', newRole, 'Old role:', oldRole);
        try {
            setIsLoadingModal(true);
          const response = await fetch(`${backendUrl}/api/useradmin/update_user_role`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userId,
              old_role: oldRole,
              new_role: newRole,
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to update user role');
          }
          await fetchUsers();
          setIsLoadingModal(false);
          // ... handle successful response ...
        } catch (error) {
          console.error('Error updating user role:', error);
          // ... handle error ...
        }
        finally {
          setIsLoadingModal(false);
          setIsEditModalOpen(false);
          setEditingUser(null);
        }
      };

      const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            setIsLoadingDeleteModal(true);
            const response = await fetch(`${backendUrl}/api/useradmin/delete_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userToDelete.email }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setIsLoadingDeleteModal(false);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };



    if (loading) {
      return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
      <div className="mx-4 md:mx-8 lg:mx-16">
        <div className="overflow-x-auto">
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full bg-white shadow-md rounded-lg border-2 border-gray-200 table-fixed">
              <thead className="bg-gray-100 sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-extrabold text-charterdeepblue uppercase tracking-wider border-b-2 border-gray-200"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center">
                            {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                            {header.column.getCanSort() && ( // Only render sort icon if column is sortable
                              <span className="ml-2 cursor-pointer">
                                {{
                                  asc: <FaSortUp className="text-blue-500" />,
                                  desc: <FaSortDown className="text-blue-500" />,
                                }[header.column.getIsSorted() as string] ?? <FaSort className="text-gray-400" />}
                              </span>
                            )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm border-b border-gray-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isEditModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl text-charterdeepblue text-center font-bold mb-4">Edit Permissions</h2>
              <p className="font-semibold mb-4">Edit role for: <span className="text-gray-500">{editingUser.email}</span></p>
              <div className="mb-4">
                <p className="font-semibold">Current role: <span className="text-gray-500">{editingUser.role}</span></p>
              </div>
              <div className="mb-6">
                <label htmlFor="newRole" className="block font-semibold mb-2">Update role:</label>
                <select
                  id="newRole"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={isLoadingModal}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {editingUser.email === userContextEmail && (
                  <div className="mt-2 text-red-500 text-sm font-semibold italic">
                    *Note*: If you change your own role from admin to user, please log out and log in again for changes to take effect. You will not be able to access this page or change your role back to admin.
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  disabled={isLoadingModal}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRoleChange(editingUser.email, newRole, editingUser.role)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                  disabled={isLoadingModal}
                >
                  {isLoadingModal ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Role'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && userToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <div className="flex items-center justify-center text-red-500 mb-4">
                        <FaExclamationTriangle className="text-4xl" />
                    </div>
                    <h2 className="text-xl text-center font-bold mb-2">Confirm Deletion</h2>
                    <p className="text-center mb-6">
                        Are you sure you want to delete user:
                        <br />
                        <span className="font-semibold">{userToDelete.email}</span>?
                    </p>
                    {userToDelete.email === userContextEmail && (
                    <p className="text-center text-xs mb-4 max-w-3/4 mx-auto text-red-600">YOU ARE ABOUT TO DELETE YOURSELF. You will not be able to access the application if you do this. Please log out for the changes to take effect.</p>
                    )}
                    <p className="text-center text-xs mb-4 max-w-3/4 mx-auto text-red-600">Note: This will remove the user from the system. They will not be able to access the application. If their email is in the pre-approved user list, they will still be able to sign up, so please be sure to remove them from the pre-approved list if you want to prevent them from signing up again.</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            disabled={isLoadingDeleteModal}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center justify-center"
                            disabled={isLoadingDeleteModal}
                        >
                            {isLoadingDeleteModal ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                'Delete User'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>

    );
};

export default ActiveUsersTable;
