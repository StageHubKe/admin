import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  getAllGigPosters,
  deleteGigPoster,
  updateGigPoster,
  clearMessages,
} from "../../redux/reducers/gigPosterSlice";
import { Loader2, Music2, MoreHorizontal } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  filled: "bg-gray-200 text-gray-600",
};

const GigManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { gigs, loading, error, successMessage } = useSelector(
    (state: RootState) => state.gigPoster
  );

  const [currentPage, setCurrentPage] = useState(1);
  const gigsPerPage = 8;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedBudget, setEditedBudget] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // Track which row actions are shown

  useEffect(() => {
    dispatch(getAllGigPosters());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timeout = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, error, dispatch]);

  // Pagination
  const indexOfLastGig = currentPage * gigsPerPage;
  const indexOfFirstGig = indexOfLastGig - gigsPerPage;
  const currentGigs = gigs.slice(indexOfFirstGig, indexOfLastGig);
  const totalPages = Math.ceil(gigs.length / gigsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Edit
  const handleStartEdit = (gigId: string, currentBudget: string) => {
    setEditingId(gigId);
    setEditedBudget(currentBudget);
    setExpandedRow(gigId); // Automatically expand actions when editing
  };
  const handleSaveEdit = (gigId: string) => {
    if (editedBudget.trim()) {
      dispatch(updateGigPoster({ _id: gigId, updatedData: { budget: editedBudget } }));
      setEditingId(null);
      setExpandedRow(null);
    }
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedBudget("");
    setExpandedRow(null);
  };

  const handleDelete = (gigId: string) => {
    if (window.confirm("Are you sure you want to delete this gig post?")) {
      dispatch(deleteGigPoster(gigId));
      setExpandedRow(null);
    }
  };

  const handleStatusChange = (gigId: string, status: string) => {
    dispatch(updateGigPoster({ _id: gigId, updatedData: { status } }));
  };

  const toggleRowActions = (gigId: string) => {
    setExpandedRow(expandedRow === gigId ? null : gigId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <Music2 className="w-6 h-6 text-indigo-600" /> 🎵 Gig Post Management
      </h1>

      {loading && (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-indigo-600 w-6 h-6" />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      {!loading && gigs.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Planner</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentGigs.map((gig, index) => (
                  <tr key={gig._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-500">{indexOfFirstGig + index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{gig.eventName || "Untitled Gig"}</td>
                    <td className="px-4 py-3 text-gray-600">{gig.eventPlannerName || "N/A"}</td>

                    <td className="px-4 py-3">
                      {editingId === gig._id ? (
                        <input
                          type="text"
                          value={editedBudget}
                          onChange={(e) => setEditedBudget(e.target.value)}
                          className="border border-indigo-400 rounded-md px-2 py-1 text-sm focus:ring focus:ring-indigo-200 outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="font-semibold text-gray-800">{gig.budget || "N/A"}</span>
                      )}
                    </td>

                    <td className="px-4 py-3 flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          statusColors[gig.status || "pending"]
                        }`}
                      >
                        {gig.status || "Pending"}
                      </span>
                      <select
                        value={gig.status || "pending"}
                        onChange={(e) => handleStatusChange(gig._id!, e.target.value)}
                        className="border rounded-md px-2 py-1 text-xs focus:ring focus:ring-indigo-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="filled">Filled</option>
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRowActions(gig._id!)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {expandedRow === gig._id && (
                        <div className="mt-2 flex flex-col gap-2">
                          {editingId === gig._id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(gig._id!)}
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
                                onClick={() => handleStartEdit(gig._id!, gig.budget || "")}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(gig._id!)}
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
                  currentPage === 1 ? "text-gray-400 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-100"
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
                      ? "bg-indigo-500 text-white border-indigo-500"
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
                  currentPage === totalPages ? "text-gray-400 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && <p className="text-gray-500">No gig posts found.</p>
      )}
    </div>
  );
};

export default GigManagement;
