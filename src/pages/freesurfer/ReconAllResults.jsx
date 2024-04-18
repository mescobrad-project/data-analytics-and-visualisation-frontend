import "./reconallresults.scss"
import Samseg_Whole_Brain_Measurements_Widget from "../../components/freesurfer/widget/Samseg_whole_brain_measurements_widget";
import React from 'react';
import ReconallVolumeDatatable from "../../components/freesurfer/datatable/ReconallVolumeDatatable";
import Aseg from "../../components/freesurfer/datatable/Aseg";
import {Divider, Tab, Tabs, Typography, Grid, Button} from "@mui/material";
import {Box} from "@mui/system";
import {GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import PropTypes from 'prop-types';
import API from "../../axiosInstance";
import ReactLoading from "react-loading";

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
            tabvalue: 0,
            done: false
        }
        this.handleTabChange = this.handleTabChange.bind(this);
        this.downloadData = this.downloadData.bind(this);
        this.handleProceed = this.handleProceed.bind(this)
        this.downloadData()
    }

    async downloadData(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("/reconall_files_to_local",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                    }
                }).then(res => {
            this.setState({done: true})
        });
    }

    // TODO CHANGE THIS TO NEW FUNCTION function_save_data
    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.put("reconall_files_to_datalake",
                {
                    workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
        )
        window.location.replace("/")
    }

    render() {
        return (
                <>
                    {!this.state.done ? (
                            <div className="loadingContainer">
                                <div className="reactLoading">
                                    <ReactLoading
                                        type={"spin"}
                                        color={"#61dafb"}
                                        height={100}
                                        width={100}
                                    />
                                </div>
                                <Typography variant="h5" sx={{flexGrow: 2, textAlign: "center"}} noWrap>
                                    Downloading Stats...
                                </Typography>
                            </div>
                    ) : (
                            <ul>
                                <div className="reconallresults">
                                    <Grid xs={12} direction='column'>
                                        <Typography variant="h5" sx={{flexGrow: 2, textAlign: "center"}} noWrap>
                                            Recon-all Results
                                        </Typography>
                                        <Divider sx={{bgcolor: "black"}}/>
                                        <Box sx={{width: '100%'}}>
                                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                                <Tabs value={this.state.tabvalue}
                                                      onChange={this.handleTabChange}
                                                      aria-label="basic tabs example"
                                                      variant="scrollable"
                                                      scrollButtons="auto">
                                                    <Tab label="Images" {...a11yProps(0)} />
                                                    <Tab label="aseg.stats" {...a11yProps(1)} />
                                                    <Tab label="brainvol.stats" {...a11yProps(2)} />
                                                    <Tab label="*h.aparc.a2009s.stats" {...a11yProps(3)} />
                                                    <Tab label="*h.aparc.DKTatlas.stats" {...a11yProps(4)} />
                                                    <Tab label="*h.aparc.pial.stats" {...a11yProps(5)} />
                                                    <Tab label="*h.aparc.stats" {...a11yProps(6)} />
                                                    <Tab label="*h.BA_exvivo.stats" {...a11yProps(7)} />
                                                    <Tab label="*h.BA_exvivo.thresh.stats" {...a11yProps(8)} />
                                                    <Tab label="*h.w-g.pct.stats" {...a11yProps(9)} />
                                                    <Tab label="wmparc.stats" {...a11yProps(10)} />


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
                                            <form onSubmit={this.handleProceed}>
                                                <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit">
                                                    Proceed >
                                                </Button>
                                            </form>
                                        </TabPanel>
                                        <TabPanel value={this.state.tabvalue} index={1}>
                                            <div className="reconallContainer">
                                                <h3>Segmentation Statistics </h3>
                                                <div className="widgets">
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="aseg.stats" hemisphere="Whole"/>
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
                                        <TabPanel value={this.state.tabvalue} index={2}>
                                            <div className="reconallContainer">
                                                <h3>Brain Volume Statistics</h3>
                                                <div className="widgets">
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="brainvol.stats" hemisphere="Whole"/>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={this.state.tabvalue} index={3}>
                                            <div className="reconallContainer">
                                                <h3>Cortical Parcellation Stats</h3>
                                                <div className="widgets">
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="lh.aparc.a2009s.stats" hemisphere="Left"/>
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="rh.aparc.a2009s.stats" hemisphere="Right"/>
                                                </div>
                                                <h3>Structural Measurements</h3>
                                                <div className="list">
                                                    <div className="listContainer">
                                                        <ReconallVolumeDatatable requested_file="*h.aparc.a2009s.stats"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={this.state.tabvalue} index={4}>
                                            <div className="reconallContainer">
                                                <h3>Cortical Parcellation Stats</h3>
                                                <div className="widgets">
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="lh.aparc.DKTatlas.stats" hemisphere="Left"/>
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="rh.aparc.DKTatlas.stats" hemisphere="Right"/>
                                                </div>
                                                <h3>Structural Measurements</h3>
                                                <div className="list">
                                                    <div className="listContainer">
                                                        <ReconallVolumeDatatable requested_file="*h.aparc.DKTatlas.stats"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={this.state.tabvalue} index={5}>
                                            <div className="reconallContainer">
                                                <h3>Cortical Parcellation Stats</h3>
                                                <div className="widgets">
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="lh.aparc.pial.stats" hemisphere="Left"/>
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="rh.aparc.pial.stats" hemisphere="Right"/>
                                                </div>
                                                <h3>Structural Measurements</h3>
                                                <div className="list">
                                                    <div className="listContainer">
                                                        <ReconallVolumeDatatable requested_file="*h.aparc.pial.stats"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={this.state.tabvalue} index={6}>
                                            <div className="reconallContainer">
                                                <h3>Cortical Parcellation Stats</h3>
                                                <div className="widgets">
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="lh.aparc.stats" hemisphere="Left"/>
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="rh.aparc.stats" hemisphere="Right"/>
                                                </div>
                                                <h3>Structural Measurements</h3>
                                                <div className="list">
                                                    <div className="listContainer">
                                                        <ReconallVolumeDatatable requested_file="*h.aparc.stats"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={this.state.tabvalue} index={7}>
                                            <div className="reconallContainer">
                                                <h3>Cortical Parcellation Stats</h3>
                                                <div className="widgets">
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="lh.BA_exvivo.stats" hemisphere="Left"/>
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="rh.BA_exvivo.stats" hemisphere="Right"/>
                                                </div>
                                                <h3>Structural Measurements</h3>
                                                <div className="list">
                                                    <div className="listContainer">
                                                        <ReconallVolumeDatatable requested_file="*h.BA_exvivo.stats"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={this.state.tabvalue} index={8}>
                                            <div className="reconallContainer">
                                                <h3>Cortical Parcellation Stats</h3>
                                                <div className="widgets">
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="lh.BA_exvivo.thresh.stats" hemisphere="Left"/>
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="rh.BA_exvivo.thresh.stats" hemisphere="Right"/>
                                                </div>
                                                <h3>Structural Measurements</h3>
                                                <div className="list">
                                                    <div className="listContainer">
                                                        <ReconallVolumeDatatable requested_file="*h.BA_exvivo.thresh.stats"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={this.state.tabvalue} index={9}>
                                            <div className="reconallContainer">
                                                <h3>Structural Measurements</h3>
                                                <div className="list">
                                                    <div className="listContainer">
                                                        <ReconallVolumeDatatable requested_file="*h.w-g.pct.stats"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={this.state.tabvalue} index={10}>
                                            <div className="reconallContainer">
                                                <h3>Segmentation Statistics</h3>
                                                <div className="widgets">
                                                    <Samseg_Whole_Brain_Measurements_Widget requested_file="wmparc.stats" hemisphere="Whole"/>
                                                </div>
                                                <h3>Structural Measurements</h3>
                                                <div className="list">
                                                    <div className="listContainer">
                                                        <ReconallVolumeDatatable requested_file="wmparc.stats"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                    </Grid>
                                </div>
                            </ul>
                    )}
                </>
        );
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

}
export default ReconAllResults;
