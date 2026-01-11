import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  let label = "";
  let styles = "";

  if (score > 70) {
    label = "Strong";
    styles = "bg-green-100 text-green-800";
  } else if (score > 49) {
    label = "Good start";
    styles = "bg-yellow-100 text-yellow-800";
  } else {
    label = "Needs work";
    styles = "bg-red-100 text-red-800";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles}`}>
      {label}
    </span>
  );
};

export default ScoreBadge;
