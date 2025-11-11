import React, { useState, useEffect } from "react";
import {
  Menu,
  LogOut,
  Users,
  LayoutDashboard,
  Settings,
  UserSquare2,
  CalendarDays,
  Music2,
  User,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";

import GetUsers from "../Users/getUsers";
import DashboardArtistProfile from "../Artist/getAllArtist";
import DashboardEventManagement from "../Event/EventManagement";
import GigManagement from "../Gig/GigManagement";
import { checkAdminSession, adminLogout } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Dashboard");

  const dispatch = useDispatch<AppDispatch>();
  const { admin, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const artists = useSelector((state: RootState) => state.artist.profiles);
  const events = useSelector((state: RootState) => state.event.events);
  const users = useSelector((state: RootState) => state.auth.users);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAdminSession());
  }, [dispatch]);

  // 🔹 Logout handler
  const handleLogout = async () => {
    await dispatch(adminLogout());
    setSelectedSection("Logout");
    navigate("/");
  };

  // 🔹 Render main section
  const renderContent = () => {
    switch (selectedSection) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Welcome, <span className="text-indigo-600">{admin?.name}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="Total Users" value={users.length.toString()} />
              <Card title="Active Artists" value={artists.length.toString()} />
              <Card title="Upcoming Events" value={events.length.toString()} />
            </div>
          </div>
        );
      case "Users":
        return <GetUsers />;
      case "Artist Profiles":
        return <DashboardArtistProfile />;
      case "Events":
        return <DashboardEventManagement />;
      case "Gig Posts":
        return <GigManagement />;
      case "Settings":
        return (
          <div className="text-gray-700">
            <h2 className="text-2xl font-semibold mb-4">⚙️ Settings</h2>
            <p>Manage your account settings and preferences here.</p>
          </div>
        );
      case "Logout":
        return (
          <div className="text-center text-red-500 mt-10">
            <h2 className="text-2xl font-semibold mb-2">You have been logged out.</h2>
            <p className="text-gray-600">Please close this tab or log in again to continue.</p>
          </div>
        );
      default:
        return <div>Select a section from the sidebar.</div>;
    }
  };

  // 🔹 If admin is not logged in
  if (!isAuthenticated && selectedSection !== "Logout") {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Session expired</h2>
          <p>Please log in again to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`text-xl font-bold text-indigo-600 transition-all duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            StageHub
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-indigo-100"
          >
            <Menu className="h-5 w-5 text-indigo-600" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 mt-4 space-y-2">
          {[
            { icon: <LayoutDashboard />, text: "Dashboard" },
            { icon: <Users />, text: "Users" },
            { icon: <UserSquare2 />, text: "Artist Profiles" },
            { icon: <CalendarDays />, text: "Events" },
            { icon: <Music2 />, text: "Gig Posts" },
            { icon: <Settings />, text: "Settings" },
          ].map((item) => (
            <SidebarItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              open={sidebarOpen}
              active={selectedSection === item.text}
              onClick={() => setSelectedSection(item.text)}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <SidebarItem
            icon={<LogOut />}
            text="Logout"
            open={sidebarOpen}
            active={selectedSection === "Logout"}
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">{selectedSection}</h2>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <span className="font-medium hidden sm:inline text-black">
              {admin?.name || admin?.email}
            </span>
          </div>
        </header>

        {/* Dynamic Content */}
        <section className="p-6 flex-1 overflow-auto">{renderContent()}</section>
      </main>
    </div>
  );
};

// Sidebar item
const SidebarItem = ({
  icon,
  text,
  open,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  open: boolean;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
      active
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
    }`}
  >
    <span className="w-6 h-6">{icon}</span>
    {open && <span className="ml-3 font-medium">{text}</span>}
  </button>
);

// Stat cards
const Card = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
    <h3 className="text-gray-600 text-sm">{title}</h3>
    <p className="text-2xl font-bold text-indigo-600 mt-2">{value}</p>
  </div>
);

export default Dashboard;
