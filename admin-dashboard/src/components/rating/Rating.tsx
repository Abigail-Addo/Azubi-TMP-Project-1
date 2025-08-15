import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { FaRegStar } from "react-icons/fa6";


const labels: { [index: string]: string } = {
    0.5: '0.5/5.0',
    1: '1.0/5.0',
    1.5: '1.5/5.0',
    2: '2.0/5.0',
    2.5: '2.5/5.0',
    3: '3.0/5.0',
    3.5: '3.5/5.0',
    4: '4.0/5.0',
    4.5: '4.5/5.0',
    5: '5.0/5.0',
};
export default function TextRating() {
    const value = 4.5;

    return (
        <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
            <Rating
                name="text-feedback"
                value={value}
                readOnly
                precision={0.5}
                emptyIcon={<FaRegStar style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            <Box sx={{ ml: 2 }}>{labels[value]}</Box>
        </Box>
    );
}
