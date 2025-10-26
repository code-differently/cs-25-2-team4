import React from "react";
import { Home, Search, Plus } from "lucide-react";

export const EmptyState = ({ type, searchTerm, activeRoom }) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case "search":
        return {
          icon: <Search size={48} />,
          title: "No devices found",
          message: `No devices match "${searchTerm}"`,
          suggestion: "Try adjusting your search terms"
        };
      case "room":
        return {
          icon: <Home size={48} />,
          title: `No devices in ${activeRoom}`,
          message: "This room doesn't have any devices yet",
          suggestion: "Add your first device to get started"
        };
      case "no-devices":
      default:
        return {
          icon: <Plus size={48} />,
          title: "No devices yet",
          message: "Start building your smart home",
          suggestion: "Add your first device to get started"
        };
    }
  };

  const { icon, title, message, suggestion } = getEmptyStateContent();

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      <p className="empty-state-suggestion">{suggestion}</p>
    </div>
  );
};