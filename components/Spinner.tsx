
import React from 'react';

const Spinner = ({ size = '8' }: { size?: string }) => {
  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-r-2 border-blue-500 border-solid h-${size} w-${size}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
