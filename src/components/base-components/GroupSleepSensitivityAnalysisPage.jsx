import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import "../../pages/hypothesis_testing/normality_tests.scss";
import {
    Button, Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem, Modal,
    Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import EEGSelector from "./EEGSelector";
import {Box} from "@mui/system";
import ChannelSignalPeaksChartCustom from "../ui-components/ChannelSignalPeaksChartCustom";
import EEGSelectModal from "../ui-components/EEGSelectModal";
import {useLocation} from "react-router-dom";
import {DataGrid, GridCell, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import InnerHTML from "dangerously-set-html-content";
import ProceedButton from "../ui-components/ProceedButton";
import qs from "qs";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95%",
    height: "95%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const table_sensitivity_02_sleep_statistics = [
    {
        field: "subjects",
        header_name: "Subjects",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "TIB",
        header_name: "TIB",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "SPT",
        header_name: "SPT",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "WASO",
        header_name: "WASO",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "TST",
        header_name: "TST",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "N1",
        header_name: "N1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "N2",
        header_name: "N2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "N3",
        header_name: "N3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "REM",
        header_name: "REM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "NREM",
        header_name: "NREM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "SOL",
        header_name: "SOL",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Lat_N1",
        header_name: "Lat_N1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Lat_N2",
        header_name: "Lat_N2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Lat_N3",
        header_name: "Lat_N3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Lat_REM",
        header_name: "Lat_REM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%N1',
        header_name: "%N1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%N2',
        header_name: "%N2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%N3',
        header_name: "%N3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%REM',
        header_name: "%REM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%NREM',
        header_name: "%NREM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: 'SE',
        header_name: "SE",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: 'SME',
        header_name: "SME",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }
]

const table_sensitivity_03_sleep_statistics = [
    {
    field: "subjects",
    header_name: "Subjects",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
    {
        field: "TIB",
        header_name: "TIB",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "SPT",
        header_name: "SPT",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "WASO",
        header_name: "WASO",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "TST",
        header_name: "TST",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "N1",
        header_name: "N1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "N2",
        header_name: "N2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "N3",
        header_name: "N3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "REM",
        header_name: "REM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "NREM",
        header_name: "NREM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "SOL",
        header_name: "SOL",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Lat_N1",
        header_name: "Lat_N1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Lat_N2",
        header_name: "Lat_N2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Lat_N3",
        header_name: "Lat_N3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Lat_REM",
        header_name: "Lat_REM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%N1',
        header_name: "%N1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%N2',
        header_name: "%N2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%N3',
        header_name: "%N3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%REM',
        header_name: "%REM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: '%NREM',
        header_name: "%NREM",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: 'SE',
        header_name: "SE",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: 'SME',
        header_name: "SME",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }
]

const table_group_sleep_statistics = [
{
    field: "subjects",
    header_name: "Subjects",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "TIB",
    header_name: "TIB",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "SPT",
    header_name: "SPT",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "WASO",
    header_name: "WASO",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "TST",
    header_name: "TST",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "N1",
    header_name: "N1",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "N2",
    header_name: "N2",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "N3",
    header_name: "N3",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "REM",
    header_name: "REM",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "NREM",
    header_name: "NREM",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "SOL",
    header_name: "SOL",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "Lat_N1",
    header_name: "Lat_N1",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "Lat_N2",
    header_name: "Lat_N2",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "Lat_N3",
    header_name: "Lat_N3",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: "Lat_REM",
    header_name: "Lat_REM",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: '%N1',
    header_name: "%N1",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: '%N2',
    header_name: "%N2",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: '%N3',
    header_name: "%N3",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: '%REM',
    header_name: "%REM",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: '%NREM',
    header_name: "%NREM",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: 'SE',
    header_name: "SE",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
{
    field: 'SME',
    header_name: "SME",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
}
]

const table_sensitivity_02_worthless = [
        {
    field: "0",
    header_name: "0",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
    {
        field: "1",
        header_name: "1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "2",
        header_name: "2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "3",
        header_name: "3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "4",
        header_name: "4",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }
]

const table_sensitivity_03_worthless = [
    {
        field: "0",
        header_name: "0",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "1",
        header_name: "1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "2",
        header_name: "2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "3",
        header_name: "3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "4",
        header_name: "4",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }
]

const table_group_sleep_matrix = [
        {
    field: "0",
    header_name: "0",
    width: '10%',
    align: "center",
    header_align: "center",
    flex:1
},
    {
        field: "1",
        header_name: "1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "2",
        header_name: "2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "3",
        header_name: "3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "4",
        header_name: "4",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }
]

const table_sensitivity_02_sleep_matrix = [
    {
        field: "0",
        header_name: "0",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "1",
        header_name: "1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "2",
        header_name: "2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "3",
        header_name: "3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "4",
        header_name: "4",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }

]

const table_sensitivity_03_sleep_matrix = [
    {
        field: "0",
        header_name: "0",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "1",
        header_name: "1",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "2",
        header_name: "2",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "3",
        header_name: "3",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "4",
        header_name: "4",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }

]

const table_group_sleep_stability = [
    {
        field: "subjects",
        header_name: "Subjects",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "0",
        header_name: "0",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }

]

const table_sensitivity_02_sleep_stability = [
    {
        field: "subjects",
        header_name: "Subjects",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "0",
        header_name: "0",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }
]

const table_sensitivity_03_sleep_stability = [
    {
        field: "subjects",
        header_name: "Subjects",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "0",
        header_name: "0",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }
]

const table_group_bandpower = [
    {
        field: "Delta",
        header_name: "Delta",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Theta",
        header_name: "Theta",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Alpha",
        header_name: "Alpha",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Sigma",
        header_name: "Sigma",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Beta",
        header_name: "Beta",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Gamma",
        header_name: "Gamma",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "TotalAbsPow",
        header_name: "TotalAbsPow",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "FreqRes",
        header_name: "FreqRes",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Relative",
        header_name: "Relative",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }

]

const table_sensitivity_02_bandpower = [
    {
        field: "Delta",
        header_name: "Delta",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Theta",
        header_name: "Theta",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Alpha",
        header_name: "Alpha",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Sigma",
        header_name: "Sigma",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Beta",
        header_name: "Beta",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Gamma",
        header_name: "Gamma",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "TotalAbsPow",
        header_name: "TotalAbsPow",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "FreqRes",
        header_name: "FreqRes",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Relative",
        header_name: "Relative",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }

]

const table_sensitivity_03_bandpower = [
    {
        field: "Delta",
        header_name: "Delta",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Theta",
        header_name: "Theta",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Alpha",
        header_name: "Alpha",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Sigma",
        header_name: "Sigma",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Beta",
        header_name: "Beta",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Gamma",
        header_name: "Gamma",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "TotalAbsPow",
        header_name: "TotalAbsPow",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "FreqRes",
        header_name: "FreqRes",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    },
    {
        field: "Relative",
        header_name: "Relative",
        width: '10%',
        align: "center",
        header_align: "center",
        flex:1
    }

]

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
class GroupSleepSensitivityAnalysisPage extends React.Component {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // Utils
            selected_channels: [],
            group_names: [],
            displayed_channel: "",
            tabvalue: 0,
            channels: [],

            // Results
            data_sensitivity_02_sleep_statistics : [],
            data_sensitivity_03_sleep_statistics_first_half: [],
            data_sensitivity_03_sleep_statistics_second_half: [],
            data_group_sleep_statistics : [],
            data_sensitivity_02_worthless : [],
            data_sensitivity_03_worthless_first_half : [],
            data_sensitivity_03_worthless_second_half : [],
            data_group_sleep_matrix : [],
            data_sensitivity_02_sleep_matrix : [],
            data_sensitivity_03_sleep_matrix_first_half : [],
            data_sensitivity_03_sleep_matrix_second_half : [],
            data_group_sleep_stability : [],
            data_sensitivity_02_sleep_stability : [],
            data_sensitivity_03_sleep_stability_first_half : [],
            data_sensitivity_03_sleep_stability_second_half : [],
            data_group_bandpower : [],
            data_sensitivity_02_bandpower : [],
            data_sensitivity_03_bandpower_first_half : [],
            data_sensitivity_03_bandpower_second_half : [],
            // available_channels: [],

            // Plot starting points
            plot_path: ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") ,
        };

        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchChannels = this.fetchChannels.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);

        this.fetchChannels()
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.get("/group_sleep_analysis_sensitivity_add_subject_add_channels_final", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                //TODO UPDATE THIS VARIABLE TO A PROPER ONE
                // sampling_frequency: 5,
                // channels_selection: null,
                channels_selection: this.state.selected_channels,
                // channels_selection: [],
                // name: this.state.selected_channel,
                // sampling_frequency: 1/30,
            },
            // This is used to pass parameters as list for fastapi to accept it correctly
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            console.log("Results")
            console.log(res.data)
            console.log(JSON.parse(res.data.result_sensitivity_02_sleep_statistics))
            this.setState({data_sensitivity_02_sleep_statistics: JSON.parse(res.data.result_sensitivity_02_sleep_statistics)})
            this.setState({data_sensitivity_03_sleep_statistics_first_half: JSON.parse(res.data.result_sensitivity_03_sleep_statistics_first_half_list)})
            this.setState({data_sensitivity_03_sleep_statistics_second_half: JSON.parse(res.data.result_sensitivity_03_sleep_statistics_second_half_list)})
            // this.setState({data_group_sleep_statistics: JSON.parse(res.data.result_group_sleep_statistics)})
            this.setState({data_group_sleep_statistics: res.data.result_group_sleep_statistics})
            this.setState({data_sensitivity_02_worthless: JSON.parse(res.data.result_sensitivity_02_worthless)})
            this.setState({data_sensitivity_03_worthless_first_half: JSON.parse(res.data.result_sensitivity_03_worthless_first_half)})
            this.setState({data_sensitivity_03_worthless_second_half: JSON.parse(res.data.result_sensitivity_03_worthless_second_half)})
            // this.setState({data_group_sleep_matrix: JSON.parse(res.data.result_group_sleep_matrix)})
            this.setState({data_group_sleep_matrix: res.data.result_group_sleep_matrix})
            this.setState({data_sensitivity_02_sleep_matrix: JSON.parse(res.data.result_sensitivity_02_sleep_matrix)})
            this.setState({data_sensitivity_03_sleep_matrix_first_half: JSON.parse(res.data.result_sensitivity_03_sleep_matrix_first_half)})
            this.setState({data_sensitivity_03_sleep_matrix_second_half: JSON.parse(res.data.result_sensitivity_03_sleep_matrix_second_half)})
            // this.setState({data_group_sleep_stability: JSON.parse(res.data.result_group_sleep_stability)})
            this.setState({data_group_sleep_stability: res.data.result_group_sleep_stability})
            this.setState({data_sensitivity_02_sleep_stability:JSON.parse( res.data.result_sensitivity_02_stability)})
            this.setState({data_sensitivity_03_sleep_stability_first_half: JSON.parse(res.data.result_sensitivity_03_stability_first_half)})
            this.setState({data_sensitivity_03_sleep_stability_second_half: JSON.parse(res.data.result_sensitivity_03_stability_second_half)})
            this.setState({data_group_bandpower: JSON.parse(res.data.result_bandpower)})
            this.setState({data_sensitivity_02_bandpower: JSON.parse(res.data.result_sensitivity_bandpower_02)})
            this.setState({data_sensitivity_03_bandpower_first_half: JSON.parse(res.data.result_sensitivity_bandpower_03_first_half)})
            this.setState({data_sensitivity_03_bandpower_second_half: JSON.parse(res.data.result_sensitivity_bandpower_03_second_half)})
        });
    }


    async fetchChannels() {
        const params = new URLSearchParams(window.location.search);
        API.get("/list/channels/group", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
            }

        }).then(res => {
            this.setState({channels: res.data.channels})
            this.setState({group_names: res.data.group_names})
            console.log(res.data.channels)
        });
    }

    handleListDelete(event) {
        var newArray = this.state.selected_channels.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_channels:newList})
    }

    handleDeleteVariable(event) {
        this.setState({selected_channels:[]})
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    handleSelectChannelChange(event){
        this.setState({ selected_channels: [...this.state.selected_channels, event.target.value] })
        this.setState({displayed_channel: event.target.value})
        // this.setState( {selected_channel: event.target.value})
        //
        // this.setState( {available_channels: event.target.value})
        // var newArray = this.state.selected_variables.slice();
        // if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        // {
        //     newArray.push(this.state.selected_file_name+"--"+event.target.value);
        // }
        // this.setState({selected_variables:newArray})

    }

    debug = () => {
        console.log("DEBUG")
        // console.log(this.state.result_sleep_transition_matrix["figure"]["figure"])
        // console.log(JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"]))
        // console.log(JSON.parse(this.state.result_sleep_transition_matrix["counts_transition_matrix"]))
        // console.log(JSON.parse(this.state.result_sleep_transition_matrix["conditional_probability_transition_matrix"]))
        // console.log(JSON.parse(this.state.result_sleep_stability_extraction["sleep_stage_stability"]))
        console.log(JSON.parse(this.state.result_band_power["bandpower"]))
        // console.log(JSON.parse(this.state.result_spectogram["figure"]["figure"]))
        console.log(this.state.result_spectogram["figure"]["figure"])

    };

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                            Group Sleep Analysis Parameterisation
                        </Typography>
                        <Divider sx={{bgcolor: "black"}}/>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                            <InputLabel id="channel-selector-label">Channel</InputLabel>
                            <Select
                                    labelId="channel-selector-label"
                                    id="channel-selector"
                                    value= {this.state.displayed_channel}
                                    label="Channel"
                                    onChange={this.handleSelectChannelChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.state.channels.map((channel) => (
                                        <MenuItem value={channel}>{channel}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Select Channels to perform sleep analysis</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected variables [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_channels.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleListDelete}>
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                            </div>
                            <Button onClick={this.handleDeleteVariable}>
                                Clear all
                            </Button>
                        </FormControl>
                        <Divider/>
                        {/* The form only appears when this.state.channels has any value which happens only when the forms
                    knows what file to access*/}
                        <form onSubmit={this.handleSubmit}>
                            <Divider/>
                            <Button sx={{float: "left", marginLeft: "2px"}} variant="contained" color="primary"
                                    type="submit">
                                Submit
                            </Button>
                            <ProceedButton></ProceedButton>
                        </form>
                    </Grid>

                    <Grid item xs={9}  direction='column'>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                            Result Visualisation
                        </Typography>
                        <Divider sx={{bgcolor: "black"}}/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue}
                                      onChange={this.handleTabChange}
                                      aria-label="basic tabs example"
                                      // variant="scrollable"
                                      TabIndicatorProps={{ sx: { display: 'none' } }}
                                      sx={{
                                          '& .MuiTabs-flexContainer': {
                                              flexWrap: 'wrap',
                                          },
                                      }}
                                >
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    >
                                    <Tab label="Sensitivity 02 Sleep Statistics" {...a11yProps(1)} />
                                    >
                                    <Tab label="Sensitivity 03 Sleep Statistics" {...a11yProps(2)} />
                                    >
                                    <Tab label="Sleep Statistics" {...a11yProps(3)} />
                                    >
                                    <Tab label="Sensitivity 02 Worthless" {...a11yProps(4)} />
                                    >
                                    <Tab label="Sensitivity 03 Worthless" {...a11yProps(5)} />
                                    >
                                    <Tab label="Sensitivity 02 Sleep Matrix" {...a11yProps(6)} />
                                    >
                                    <Tab label="Sensitivity 03 Sleep Matrix" {...a11yProps(7)} />
                                    >
                                    <Tab label="Sleep Matrix" {...a11yProps(8)} />
                                    >
                                    <Tab label="Sleep Stability" {...a11yProps(9)} />
                                    >
                                    <Tab label="Sensitivity 02 Sleep Stability" {...a11yProps(10)} />
                                    >
                                    <Tab label="Sensitivity 03  Sleep Stability" {...a11yProps( 11)} />
                                    >
                                    <Tab label="Bandpower" {...a11yProps(12)} />
                                    >
                                    <Tab label="Sensitivity 02 Bandpower" {...a11yProps(13)} />
                                    >
                                    <Tab label="Sensitivity 03 Bandpower" {...a11yProps(14)} />
                                    >
                                </Tabs>
                            </Box>

                        </Box>
                        <TabPanel value={this.state.tabvalue} index={0}>
                            {/*<DataGrid sx={{width:'90%', height:'500px', display: flex, marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}*/}
                            {/*          zeroMinWidth*/}
                            {/*          rowHeight={40}*/}
                            {/*          className="datagrid"*/}
                            {/*          rows= {this.state.result_slowave_dataframe_1_table}*/}
                            {/*          columns= {result_slowave_dataframe_1_table}*/}
                            {/*          pageSize= {10}*/}
                            {/*          rowsPerPageOptions={[10]}*/}
                            {/*          components={{*/}
                            {/*              Toolbar: CustomToolbar,*/}
                            {/*          }}*/}
                            {/*/>*/}
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={1}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_02_sleep_statistics}
                                      columns= {table_sensitivity_02_sleep_statistics}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={2}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_sleep_statistics_first_half}
                                      columns= {table_sensitivity_03_sleep_statistics}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />

                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_sleep_statistics_second_half}
                                      columns= {table_sensitivity_03_sleep_statistics}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={3}>
                            {this.state.data_group_sleep_statistics.map((data) => (
                                <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                          zeroMinWidth
                                          rowHeight={40}
                                          className="datagrid"
                                          rows= {JSON.parse(data)}
                                          columns= {table_group_sleep_statistics}
                                          pageSize= {10}
                                          rowsPerPageOptions={[10]}
                                          components={{
                                              Toolbar: CustomToolbar,
                                          }}
                                />
                            ))}
                            {/*<DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}*/}
                            {/*          zeroMinWidth*/}
                            {/*          rowHeight={40}*/}
                            {/*          className="datagrid"*/}
                            {/*          rows= {this.state.data_group_sleep_statistics}*/}
                            {/*          columns= {table_group_sleep_statistics}*/}
                            {/*          pageSize= {10}*/}
                            {/*          rowsPerPageOptions={[10]}*/}
                            {/*          components={{*/}
                            {/*              Toolbar: CustomToolbar,*/}
                            {/*          }}*/}
                            {/*/>*/}
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={4}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_02_worthless}
                                      columns= {table_sensitivity_02_worthless}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={5}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_worthless_first_half}
                                      columns= {table_sensitivity_03_worthless}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_worthless_second_half}
                                      columns= {table_sensitivity_03_worthless}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={6}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_02_sleep_matrix}
                                      columns= {table_sensitivity_02_sleep_matrix}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={7}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_sleep_matrix_first_half}
                                      columns= {table_sensitivity_03_sleep_matrix}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_sleep_matrix_second_half}
                                      columns= {table_sensitivity_03_sleep_matrix}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={8}>
                            {this.state.data_group_sleep_matrix.map((data) => (
                                <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                          zeroMinWidth
                                          rowHeight={40}
                                          className="datagrid"
                                          rows= {JSON.parse(data)}
                                          columns= {table_group_sleep_matrix}
                                          pageSize= {10}
                                          rowsPerPageOptions={[10]}
                                          components={{
                                              Toolbar: CustomToolbar,
                                          }}
                                />
                            ))}

                            {/*<DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}*/}
                            {/*          zeroMinWidth*/}
                            {/*          rowHeight={40}*/}
                            {/*          className="datagrid"*/}
                            {/*          rows= {this.state.data_group_sleep_matrix}*/}
                            {/*          columns= {table_group_sleep_matrix}*/}
                            {/*          pageSize= {10}*/}
                            {/*          rowsPerPageOptions={[10]}*/}
                            {/*          components={{*/}
                            {/*              Toolbar: CustomToolbar,*/}
                            {/*          }}*/}
                            {/*/>*/}
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={9}>
                            {this.state.data_group_sleep_stability.map((data) => (
                                <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                          zeroMinWidth
                                          rowHeight={40}
                                          className="datagrid"
                                          rows= {JSON.parse(data)}
                                          columns= {table_group_sleep_stability}
                                          pageSize= {10}
                                          rowsPerPageOptions={[10]}
                                          components={{
                                              Toolbar: CustomToolbar,
                                          }}
                                />
                            ))}
                            {this.state.group_names.map((group_name) => (
                                <React.Fragment>
                                    <Typography variant="h5" sx={{flexGrow: 2, textAlign: "center"}} noWrap>
                                       Sleep Matrix of group: {group_name}
                                    </Typography>
                                    <img src={this.state.plot_path + " /output/sleep_stage_"+ group_name +".png"+"?random=" + new Date().getTime()}
                                         srcSet={this.state.plot_path + " /output/sleep_stage_"+ group_name +".png"+"?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                         loading="lazy"
                                    />
                                    <hr/>
                                </React.Fragment>
                                ))}





                            {/*<DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}*/}
                            {/*          zeroMinWidth*/}
                            {/*          rowHeight={40}*/}
                            {/*          className="datagrid"*/}
                            {/*          rows= {this.state.data_group_sleep_stability}*/}
                            {/*          columns= {table_group_sleep_stability}*/}
                            {/*          pageSize= {10}*/}
                            {/*          rowsPerPageOptions={[10]}*/}
                            {/*          components={{*/}
                            {/*              Toolbar: CustomToolbar,*/}
                            {/*          }}*/}
                            {/*/>*/}
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={10}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_02_sleep_stability}
                                      columns= {table_sensitivity_02_sleep_stability}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={11}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_sleep_stability_first_half}
                                      columns= {table_sensitivity_03_sleep_stability}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_sleep_stability_second_half}
                                      columns= {table_sensitivity_03_sleep_stability}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={12}>
                            {/*{this.state.data_group_bandpower.map((data) => (*/}
                            {/*    <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}*/}
                            {/*              zeroMinWidth*/}
                            {/*              rowHeight={40}*/}
                            {/*              className="datagrid"*/}
                            {/*              rows= {JSON.parse(data)}*/}
                            {/*              columns= {table_group_bandpower}*/}
                            {/*              pageSize= {10}*/}
                            {/*              rowsPerPageOptions={[10]}*/}
                            {/*              components={{*/}
                            {/*                  Toolbar: CustomToolbar,*/}
                            {/*              }}*/}
                            {/*    />*/}
                            {/*))}*/}

                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_group_bandpower}
                                      columns= {table_group_bandpower}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={13}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_02_bandpower}
                                      columns= {table_sensitivity_02_bandpower}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={14}>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_bandpower_first_half}
                                      columns= {table_sensitivity_03_bandpower}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.data_sensitivity_03_bandpower_second_half}
                                      columns= {table_sensitivity_03_bandpower}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                        </TabPanel>

                    </Grid>
                </Grid>
        )
    }
}

export default GroupSleepSensitivityAnalysisPage;
