import React from 'react';
import {Grid} from '@mui/material'

const LayoutSimpleFunctions = ({leftColumn , mainContent , rightColumn}) => {
    return (
        <Grid container spacing={0} direction= "column">
            <Grid item container spacing={0} direction="row">
                <Grid item xs={2}>
                    {leftColumn}
                </Grid>
                <Grid item xs={8} >
                    {mainContent}
                </Grid>
                <Grid item xs={2}>
                    {rightColumn}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default LayoutSimpleFunctions;
