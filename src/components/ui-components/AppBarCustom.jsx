import {AppBar, Box, Container, Link, ListItemButton, Toolbar, Typography} from '@mui/material'
import React from 'react';

const AppBarCustom = () => {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="relative">
                <Toolbar>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/"
                    >
                        <Typography variant="h6" sx={{ color: "#ffffff",flexGrow: 1 }} noWrap>
                        {/*<Typography variant="h6" sx={{ color: "#ffffff",flexGrow: 1 }} noWrap>*/}
                            Analytics Engine
                        </Typography>
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default AppBarCustom;
