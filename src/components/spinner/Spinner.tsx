// Spinner.tsx
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-4 h-4 border-2 border-t-4 border-white border-t-black rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
