import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 text-gray-900 p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
                {children}
            </div>
        </div>


    )
}
