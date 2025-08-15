"use client"

import React from 'react';
import { CiLogout } from "react-icons/ci";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logout } from '@/lib/features/adminAuth/adminAuthSlice';
import { Alert, Snackbar, CircularProgress } from '@mui/material';

const Footer = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading } = useAppSelector(state => state.adminAuth);

    const alertRef = React.useRef<{ severity: 'success' | 'error'; message: string } | null>(null);
    const [alertVisible, setAlertVisible] = React.useState(false);

    const showAlert = (severity: 'success' | 'error', message: string) => {
        alertRef.current = { severity, message };
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 6000);
    };

    let firstName = "";
    let email = "";

    if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            firstName = parsedUser.firstName || "";
            email = parsedUser.email || "";
        }
    }

    const handleLogout = async () => {
        try {
            const resultAction = await dispatch(logout());
            if (logout.fulfilled.match(resultAction)) {
                showAlert('success', 'Logout successful');
                console.log(resultAction)
                router.push('/login');
            } else {
                showAlert('error', resultAction.payload as string || 'Failed to logout');
                console.log(resultAction)

            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            showAlert('error', message);
        }
    };


    return (
        <>
            <Snackbar
                open={alertVisible}
                autoHideDuration={6000}
                onClose={() => setAlertVisible(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={alertRef.current?.severity || 'success'}
                    onClose={() => setAlertVisible(false)}
                    sx={{ width: '100%' }}
                >
                    {alertRef.current?.message || ''}
                </Alert>
            </Snackbar>

            <div className='absolute bottom-0 inset-x-0 py-8 flex items-center justify-center gap-4 text-white '>
                <Image src="/assets/user.png" alt="Logo Large" width={70} height={40} priority className='' />
                <div className="flex flex-col" onClick={() => router.push('/profile')}>
                    <p>{firstName}</p>
                    <p>{email}</p>
                </div>

                <div onClick={handleLogout} className="">
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        <CiLogout className='text-2xl cursor-pointer' />
                    )}
                </div>
            </div>
        </>
    );
};

export default Footer;
