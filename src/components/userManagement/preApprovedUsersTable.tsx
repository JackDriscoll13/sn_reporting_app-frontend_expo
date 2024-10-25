// React and react-table
import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
// Icons
import { FaSort, FaSortUp, FaSortDown, FaTimes } from 'react-icons/fa';
// Backend URL
import { backendUrl } from '../../config';
import AddPreApprovedUserModal from "./addPreApprovedUserModal";

type Role = "admin" | "user";

type PreApprovedUser = {
    email: string;
    role: Role;
    date_approved: string;
}

const PreApprovedUsersTable: React.FC = () => {
    const [preApprovedUsers, setPreApprovedUsers] = useState<PreApprovedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'date_approved', desc: true } // Initial sort state
    ]);

    // State for Adding a Pre-approved User
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState<"adding" | "success" | null>(null);

    // State for Deleting a Pre-approved User
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ email: string; isOpen: boolean } | null>(null);
    const [deleting, setDeleting] = useState(false);
    

    const columnHelper = createColumnHelper<PreApprovedUser>();

    const columns = useMemo(() => [
        columnHelper.accessor("email", {
            header: "Email",
            cell: (info) => info.getValue(),
            enableSorting: false,
            meta: { className: "w-1/3" }
        }),
        columnHelper.accessor("role", {
            header: "Role",
            cell: (info) => info.getValue(),
            enableSorting: false,
            meta: { className: "w-1/3" }
        }),
        columnHelper.accessor("date_approved", {
            header: "Date Approved",
            cell: (info) => info.getValue(),
            sortingFn: (a, b) => {
                return new Date(a.original.date_approved).getTime() - new Date(b.original.date_approved).getTime();
            },
            meta: { className: "w-1/3" }
        }),
        columnHelper.accessor("email", {
            id: "delete",
            header: "",
            cell: (info) => (
                <button
                    onClick={() => setDeleteConfirmation({ email: info.row.original.email, isOpen: true })}
                    className="text-red-500 hover:text-red-700"
                >
                    <FaTimes />
                </button>
            ),
            enableSorting: false,
            meta: { className: "w-10" }
        }),
    ], []);

    const table = useReactTable({
        data: preApprovedUsers,
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
          const response = await fetch(`${backendUrl}/api/useradmin/get_pre_approved_emails`);
          if (!response.ok) {
            throw new Error('Failed to fetch pre-approved users');
          }
          const responseData = await response.json();
          setPreApprovedUsers(responseData.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch pre-approved users');
          setLoading(false);
        }
      };

    useEffect(() => {
    
        fetchUsers();
    }, []);

    const handleAddUser = async (email: string, role: Role) => {
        console.log("Adding user:", email, role);
        console.log("Sending to backend:", JSON.stringify({ email:email, role:role }));
        setModalState("adding");
        try {
            const response = await fetch(`${backendUrl}/api/useradmin/add_pre_approved_email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email:email, role:role }),
            });
            if (!response.ok) {
                throw new Error('Failed to add pre-approved user');
            }
            if (response.ok) {
                setModalState("success");
                fetchUsers();
            }
        } catch (err) {
            setError('Failed to add pre-approved user');
            setModalState(null);
        }
    };

    const handleDeleteUser = async (email: string) => {
        try {
            setDeleting(true);
            const response = await fetch(`${backendUrl}/api/useradmin/delete_pre_approved_email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email:email }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete pre-approved user');
            }

        } catch (err) {
            setError('Failed to delete pre-approved user');
        } finally {
            setDeleting(false);
            setDeleteConfirmation(null);
            fetchUsers();
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
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-6 rounded inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Pre-approved User
                </button>
            </div>
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
                                                {header.column.getCanSort() && (
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
            <AddPreApprovedUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddUser={handleAddUser}
                modalState={modalState}
                setModalState={setModalState}
            />
            
            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                        <p className="mb-6">Do you want to delete {deleteConfirmation.email} from the pre-approved users list?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteUser(deleteConfirmation.email)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center"
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default PreApprovedUsersTable;
