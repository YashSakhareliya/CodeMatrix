import { useNavigate, useLocation } from "react-router-dom";
import { Layout, BookOpen, Users, Trophy, MessageSquare } from "lucide-react";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Layout, label: "Dashboard", route: "/" },
    { icon: BookOpen, label: "Practice Problems", route: "/practice" },
    { icon: Users, label: "Groups", route: "/groups" },
    { icon: Trophy, label: "Leaderboard", route: "/leaderboard" },
    { icon: MessageSquare, label: "Discussion", route: "/discussion" },
  ];

  return (
    <div className="w-64 border-r border-matrix-border-primary p-4 flex flex-col bg-matrix-bg-secondary">
      <nav className="space-y-2">
        {navItems.map(({ icon: Icon, label, route }) => (
          <button
            key={route}
            onClick={() => navigate(route)}
            className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors ${
              location.pathname === route
                ? "bg-matrix-bg-tertiary text-matrix-text-secondary border border-matrix-brand-primary"
                : "hover:bg-matrix-bg-tertiary hover:text-matrix-text-secondary"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default StudentSidebar

