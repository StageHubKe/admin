import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  getAllArtistProfiles,
  updateArtistProfile,
  deleteArtistProfile,
} from "../../redux/reducers/artistSlice";
import { MoreHorizontal } from "lucide-react";

const DashboardArtistProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profiles, loading, error, successMessage } = useSelector(
    (state: RootState) => state.artist
  );

  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 8;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // Track expanded row

  useEffect(() => {
    dispatch(getAllArtistProfiles());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      dispatch(getAllArtistProfiles());
      setEditingId(null);
      setEditedName("");
      setExpandedRow(null);
    }
  }, [successMessage, dispatch]);

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(profiles.length / profilesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartEdit = (artistId: string, currentName: string) => {
    setEditingId(artistId);
    setEditedName(currentName);
    setExpandedRow(artistId); // Expand actions when editing
  };

  const handleSaveEdit = (artistId: string) => {
    if (editedName.trim()) {
      dispatch(updateArtistProfile({ _id: artistId, stageName: editedName.trim() }));
      setEditingId(null);
      setExpandedRow(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedName("");
    setExpandedRow(null);
  };

  const handleDelete = (artistId: string) => {
    if (window.confirm("Are you sure you want to delete this artist?")) {
      dispatch(deleteArtistProfile(artistId));
      setExpandedRow(null);
    }
  };

  const toggleRowActions = (artistId: string) => {
    setExpandedRow(expandedRow === artistId ? null : artistId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">🎤 Artist Directory</h1>

      {loading && <p className="text-gray-600">Loading artists...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {!loading && profiles && profiles.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Artist</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProfiles.map((artist, index) => (
                  <tr key={artist._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-500">
                      {indexOfFirstProfile + index + 1}
                    </td>

                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={artist.coverImage || "/default-avatar.png"}
                        alt={artist.stageName || "Artist"}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div className="flex flex-col">
                        {editingId === artist._id ? (
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="border border-blue-400 rounded-md px-2 py-1 text-sm focus:ring focus:ring-blue-200 outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="font-semibold text-gray-800">{artist.stageName || "Unnamed Artist"}</p>
                        )}
                        <p className="text-xs text-gray-500">{artist.genre || "N/A"}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600">{artist.location || "Unknown"}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          artist.type ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {artist.type ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRowActions(artist._id!)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {expandedRow === artist._id && (
                        <div className="mt-2 flex flex-col gap-2">
                          {editingId === artist._id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(artist._id!)}
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
                                onClick={() => handleStartEdit(artist._id!, artist.stageName || "")}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(artist._id!)}
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
                    currentPage === i + 1 ? "bg-blue-500 text-white border-blue-500" : "text-gray-700 border-gray-300 hover:bg-gray-100"
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
        !loading && <p className="text-gray-500">No artist profiles found.</p>
      )}
    </div>
  );
};

export default DashboardArtistProfile;
