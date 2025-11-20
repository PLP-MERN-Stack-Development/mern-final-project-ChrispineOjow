// Spinner.jsx (or Spinner.js)

import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils"; 

/**
 * A simple loading spinner component using the lucide-react LoaderIcon.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional class names for the SVG.
 * @returns {JSX.Element} The rotating spinner icon.
 */
function Spinner({ className, ...props }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };

