import React, {useContext, useEffect} from 'react';
import {Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader} from "@mui/material";
// import {useHistory} from "react-router-dom";
// import {AuthContext} from "../contexts/AuthContext";
//
// import {servicesInfo} from "../servicesInfo";
// import InitialPageService from "./InitialPageService";


function SendIcon() {
    return null;
}

function DraftsIcon() {
    return null;
}

function InboxIcon() {
    return null;
}

function WelcomePage() {
    useEffect(() => {
        document.title = ' MES-CoBraD | Analytics Engine'
    }, [])

    return (
            <React.Fragment>
                {/*<h1>{document.title}</h1>*/}
                <h1>MES-CoBraD | Analytics Engine</h1>
                <h3>Welcome to MES-CoBraDs' Analytics Module</h3>

                <List
                        sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                <h2>Existing pages</h2>
                            </ListSubheader>
                        }>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/auto_correlation"
                    >
                        <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                            Auto Correlation >
                        </ListItemButton>
                    </Link>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/partial_auto_correlation"
                    >
                        <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                            Partial Auto Correlation >
                        </ListItemButton>
                    </Link>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/filters"
                    >
                        <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                            Filters>
                        </ListItemButton>
                    </Link>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/welch"
                    >
                        <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                            Welch>
                        </ListItemButton>
                    </Link>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/find_peaks"
                    >
                        <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                            Find Peaks>
                        </ListItemButton>
                    </Link>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/periodogram"
                    >
                        <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                            Periodogram>
                        </ListItemButton>
                    </Link>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/stft"
                    >
                        <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius:"10px"}} component={"a"}>
                            Short Time Fourier Transform>
                              </ListItemButton>
                    </Link>
                    <Link
                            component={Link}
                            variant="h6"
                            href="/power_spectral_density"
                    >
                        <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                            Power Spectral Density>
                        </ListItemButton>
                    </Link>
                </List>

            </React.Fragment>
    );
}

export default WelcomePage;
