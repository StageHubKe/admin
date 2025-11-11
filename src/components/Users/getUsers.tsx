import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../../redux/reducers/authSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import { MoreHorizontal } from "lucide-react";

const GetUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartEdit = (userId: string, currentName: string) => {
    setEditingId(userId);
    setEditedName(currentName);
    setExpandedRow(userId);
  };

  const handleSaveEdit = async (userId: string) => {
    if (editedName.trim()) {
      await dispatch(
        updateUser({ id: userId, data: { name: editedName.trim() } })
      );
      setEditingId(null);
      setExpandedRow(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedName("");
    setExpandedRow(null);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(userId));
      setExpandedRow(null);
    }
  };

  const toggleRowActions = (userId: string) => {
    setExpandedRow(expandedRow === userId ? null : userId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        👥 User Management
      </h1>

      {loading && <p className="text-gray-600">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && users && users.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-center">Verified</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-500">
                      {indexOfFirstUser + index + 1}
                    </td>

                    {/* User Info */}
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="flex flex-col">
                        {editingId === user._id ? (
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="border border-blue-400 rounded-md px-2 py-1 text-sm focus:ring focus:ring-blue-200 outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="font-semibold text-gray-800">
                            {user.name || "Unnamed User"}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">
                      {user.role}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {user.isVerified ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                          Not Verified
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center relative">
                      <button
                        onClick={() => toggleRowActions(user._id!)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {expandedRow === user._id && (
                        <div className="mt-2 flex flex-col gap-2 absolute right-0 bg-white border p-2 rounded shadow-lg z-10">
                          {editingId === user._id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(user._id!)}
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 bg-gray-400 text-white text-xs rounded-md hover:bg-gray-500 transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  handleStartEdit(user._id!, user.name || "")
                                }
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user._id!)}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-200"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white border-blue-500"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-200"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default GetUsers;
