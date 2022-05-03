import React, {useState, useContext, useEffect} from 'react';
import {Grid, Container} from '@mui/material'
import AppBarCustom from "../components/ui-components/AppBarCustom";

const LayoutMain = ({children}) => {
    return (
        <Grid container spacing={0} direction= "column">
            <Grid item xs={12}>
                <AppBarCustom/>
            </Grid>
            <Grid item container spacing={0} direction="row">
                {/*<Grid item xs={1}>*/}
                {/*</Grid>*/}
                <Grid item xs={12} >
                    {children}
                </Grid>
                {/*<Grid item xs={1}>*/}
                {/*</Grid>*/}
            </Grid>
        </Grid>
    )
        ;
}

export default LayoutMain;
