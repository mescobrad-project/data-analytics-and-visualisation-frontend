import "./reconallresults.scss"
import Samseg_Whole_Brain_Measurements_Widget from "../../components/freesurfer/widget/Samseg_whole_brain_measurements_widget";
import React from 'react';
import ReconallVolumeDatatable from "../../components/freesurfer/datatable/ReconallVolumeDatatable";
import Aseg from "../../components/freesurfer/datatable/Aseg";
import {Divider, Tab, Tabs, Typography, Grid} from "@mui/material";
import {Box} from "@mui/system";
import {GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import PropTypes from 'prop-types';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CustomToolbar() {
    return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
            <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple-tabpanel-${index}`}
                    aria-labelledby={`simple-tab-${index}`}
                    {...other}
            >
                {value === index && (
                        <Box sx={{ p: 3 }}>
                            <Typography>{children}</Typography>
                        </Box>
                )}
            </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('../../sample-data', false, /\.(png|jpe?g|svg)$/));


class ReconAllResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Utils
            tabvalue: 0
        }
        this.handleTabChange = this.handleTabChange.bind(this);
    }
    render() {
        return (
                <div className="reconallresults">
                    <Grid xs={12} direction='column'>
                        <Typography variant="h5" sx={{flexGrow: 2, textAlign: "center"}} noWrap>
                            Result Visualisation
                        </Typography>
                        <Divider sx={{bgcolor: "black"}}/>
                        <Box sx={{width: '100%'}}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange}
                                      aria-label="basic tabs example">
                                    <Tab label="Images" {...a11yProps(0)} />
                                    <Tab label="aseg.stats" {...a11yProps(1)} />
                                </Tabs>
                            </Box>

                        </Box>
                        <TabPanel value={this.state.tabvalue} index={0}>
                            <h3>Images - Cortical Measurements</h3>
                            <div className="reconallContainer">
                                <div className="images">
                                    {/*TODO: Retrieve images from the correct folder*/}
                                    {images.map(image => (
                                        <img className="image" src={image}/>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={1}>
                            <div className="reconallContainer">
                                <h3>Cortical Parcellation Stats</h3>
                                <div className="widgets">
                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="aseg.stats"/>
                                </div>
                                <h3>Structural Measurements</h3>
                                <div className="list">
                                    <div className="listContainer">
                                        <ReconallVolumeDatatable requested_file="aseg.stats"/>
                                    </div>
                                </div>
                                <h3>Aseg segmentation - Volume (mm3)</h3>
                                <div className="Aseg">
                                    <Aseg/>
                                </div>
                            </div>
                        </TabPanel>
                    </Grid>
                </div>
        );
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

}
export default ReconAllResults;
