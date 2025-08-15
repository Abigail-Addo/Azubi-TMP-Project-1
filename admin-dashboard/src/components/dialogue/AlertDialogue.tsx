import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface DialogueProps {
    text: string;
    className?: string;
    onConfirm: () => Promise<void> | void;
    onCancel: () => void;
    // loading: boolean;
}

const AlertDialog: React.FC<DialogueProps> = ({ text, onConfirm, onCancel }) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = async () => {
        try {
            await onConfirm();
            setOpen(false);
        } catch (error) {
            console.error("Confirmation error:", error);
        }
    };

    const handleCancel = () => {
        onCancel();
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                "& .MuiDialog-paper": {
                    width: '2000px',
                    padding: '1rem',
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions className='flex items-center justify-center'>
                <div className="w-full lg:w-1/4">
                    {/* button */}
                    <div className="flex ml-auto">
                        <button
                            type="submit"
                            className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer`}
                            onClick={handleClose}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
                <div className="w-full lg:w-1/4">
                    <button
                        type="submit"
                        className={`border border-[#01589A] text-[#01589A] px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer`}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
