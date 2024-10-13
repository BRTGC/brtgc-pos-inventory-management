import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex space-x-2">
        <div className="bg-blue-600 p-2 w-4 h-4 rounded-full animate-bounce"></div>
        <div className="bg-blue-600 p-2 w-4 h-4 rounded-full animate-bounce delay-200"></div>
        <div className="bg-blue-600 p-2 w-4 h-4 rounded-full animate-bounce delay-400"></div>
      </div>
    </div>
  );
};

export default Loading;
