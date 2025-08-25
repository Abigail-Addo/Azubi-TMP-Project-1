import React, { Suspense } from "react";

// Fallback UI while client component loads
const LoadingFallback = () => (
    <div className="container mx-auto py-20 text-center">
        <p>Loading track details...</p>
    </div>
);

// Lazy-load the client component
const TrackDetailsClient = React.lazy(
    () => import("./TrackDetailsClient")
);

export default function TrackDetailsPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <TrackDetailsClient />
        </Suspense>
    );
}
