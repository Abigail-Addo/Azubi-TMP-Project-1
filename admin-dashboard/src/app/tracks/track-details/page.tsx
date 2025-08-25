"use client";

import React, { Suspense } from 'react';
import DefaultLayout from '@/app/DefaultLayout';
import TrackDetailsContent from './TrackDetailContent';

const ManageTracksPage: React.FC = () => {
    return (
        <DefaultLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <TrackDetailsContent />
            </Suspense>
        </DefaultLayout>
    );
};

export default ManageTracksPage;
