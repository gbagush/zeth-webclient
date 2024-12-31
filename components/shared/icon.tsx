import { icons } from "lucide-react";
import React from "react";

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number | string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, color, size, className }) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} size={size} className={className} />;
};

export default Icon;
