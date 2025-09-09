import React from "react";
import { useAuth } from "../contexts/AuthContext";

const MaCoinDisplay = () => {
  const { credits, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="macoin-display">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="macoin-display">
      <span>MaCoin: {credits}</span>
    </div>
  );
};

export default MaCoinDisplay; 