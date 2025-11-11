import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  getAllEvents,
  updateEvent,
  deleteEvent,
} from "../../redux/reducers/eventSlice";
import { MoreHorizontal } from "lucide-react";

const DashboardEventManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading, error, successMessage } = useSelector(
    (state: RootState) => state.event
  );

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // Track expanded row

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      dispatch(getAllEvents());
      setEditingId(null);
      setEditedTitle("");
      setExpandedRow(null);
    }
  }, [successMessage, dispatch]);

  // Pagination calculations
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartEdit = (eventId: string, currentTitle: string) => {
    setEditingId(eventId);
    setEditedTitle(currentTitle);
    setExpandedRow(eventId); // Expand actions when editing
  };

  const handleSaveEdit = (eventId: string) => {
    if (editedTitle.trim()) {
      dispatch(updateEvent({ _id: eventId, title: editedTitle.trim() }));
      setEditingId(null);
      setExpandedRow(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedTitle("");
    setExpandedRow(null);
  };

  const handleDelete = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(eventId));
      setExpandedRow(null);
    }
  };

  const toggleRowActions = (eventId: string) => {
    setExpandedRow(expandedRow === eventId ? null : eventId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        🎯 Event Management
      </h1>

      {loading && <p className="text-gray-600">Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {!loading && events && events.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event, index) => (
                  <tr
                    key={event._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-500">
                      {indexOfFirstEvent + index + 1}
                    </td>

                    {/* Event Title */}
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={event.image || "/default-event.jpg"}
                        alt={event.title}
                        className="w-10 h-10 rounded-md object-cover border"
                      />
                      <div className="flex flex-col">
                        {editingId === event._id ? (
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="border border-blue-400 rounded-md px-2 py-1 text-sm focus:ring focus:ring-blue-200 outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="font-semibold text-gray-800">
                            {event.title || "Untitled Event"}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {event.description?.slice(0, 40) || "No description"}
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 text-gray-600">
                      {event.location || "N/A"}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </td>

                    {/* Event Type */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.eventType
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {event.eventType || "General"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRowActions(event._id!)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {expandedRow === event._id && (
                        <div className="mt-2 flex flex-col gap-2">
                          {editingId === event._id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(event._id!)}
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
                                  handleStartEdit(event._id!, event.title || "")
                                }
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(event._id!)}
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
        !loading && <p className="text-gray-500">No events found.</p>
      )}
    </div>
  );
};

export default DashboardEventManagement;
