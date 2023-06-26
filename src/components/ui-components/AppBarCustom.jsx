import {AppBar, Box, Container, Divider, Link, ListItemButton, Toolbar, Typography} from '@mui/material'
import React, {useRef} from 'react';

const AppBarCustom = () => {
    const params = useRef(new URLSearchParams(window.location.search));

    console.log(params.current.get("workflow_id"))

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="relative">
                <Toolbar>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/"
                    >
                        <Typography variant="h6" sx={{ color: "#ffffff", marginRight: "2px"  }}>
                        {/*<Typography variant="h6" sx={{ color: "#ffffff",flexGrow: 1 }} noWrap>*/}
                            Analytics Engine
                        </Typography>
                    </Link>
                    <Divider orientation="vertical" sx={{bgcolor: "white"}} flexItem />
                    <Typography variant="body2" sx={{ color: "#ffffff", marginLeft: "5px", marginRight: "5px" }}>
                        {/*<Typography variant="h6" sx={{ color: "#ffffff",flexGrow: 1 }} noWrap>*/}
                        Workflow Id: <br/>
                        {params.current.get("workflow_id")}
                    </Typography>
                    <Divider orientation="vertical" sx={{bgcolor: "white"}} flexItem />
                    <Typography variant="body2" sx={{ color: "#ffffff", marginLeft: "5px", marginRight: "5px" }}>
                        {/*<Typography variant="h6" sx={{ color: "#ffffff",flexGrow: 1 }} noWrap>*/}
                        Run Id: <br/>
                        {params.current.get("run_id")}
                    </Typography>
                    <Divider orientation="vertical" sx={{bgcolor: "white"}} flexItem />
                    <Typography variant="body2" sx={{ color: "#ffffff", marginLeft: "5px", marginRight: "5px" }}>
                        {/*<Typography variant="h6" sx={{ color: "#ffffff",flexGrow: 1 }} noWrap>*/}
                        Step Id: <br/>
                        {params.current.get("step_id")}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default AppBarCustom;
