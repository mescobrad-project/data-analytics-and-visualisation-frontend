import {AppBar, Box, Container, Toolbar, Typography} from '@mui/material'
import React from 'react';

const AppBarCustom = () => {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
                        Analytics Engine
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default AppBarCustom;