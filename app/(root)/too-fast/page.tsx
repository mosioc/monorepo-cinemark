import React from "react";

const Page = () => {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Too Many Requests!
        </h1>
        <p className="text-gray-600 text-lg">
          Please wait a moment before trying again.
        </p>
      </div>
    </main>
  );
};

export default Page;
