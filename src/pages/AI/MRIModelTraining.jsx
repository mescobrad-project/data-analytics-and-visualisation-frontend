import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import "../../pages/hypothesis_testing/normality_tests.scss"
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Typography,
    Table, TableRow, TableCell, TableContainer, Paper, Tabs, Tab, TextField, TableHead, TableBody
} from "@mui/material";


//  TODO
//  ai_mri_traiing_experiment
// Page Name : Convolutional 3D Model MRI Training
// Input datapth,csvpath change to use local_storage
// Datapath: Folder with nifti files
// Csv Path: Single csv file / Columns: MRI, GROUPS
// Maybe change input not to use csv path and split datapath to N (two for us) folders

// Iterations: How many times will model will be recereated
// Batch size: How many mris are imported in the model for each parameter update: Default 4, Suggested values: 3  - 6 Increaseing this may cause stability issues do not increase unless certain
// Learening Rate: 0.001 Default , Suggested values 0.01 , 0.0001  learning rate is a tuning parameter in an optimization algorithm that determines the step size at each iteration while moving toward a minimum of a loss function
//  Early Stopping Patience: Number of epochs without validation loss improvement Default 15 , Suggested 10 < x <100

// Output
// pth file output
// img to display


// Outpute


// Amcharts
import qs from "qs";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import ProceedButton from "../../components/ui-components/ProceedButton";
import SelectorWithCheckBoxes from "../../components/ui-components/SelectorWithCheckBoxes";
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


class MRIModelTraining extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // List of columns sent by the backend
            model_names: [],
            selected_data: '',
            data_names: [],
            selected_csv: '',
            csv_names: [],
            selected_lr: 0.001,
            selected_batch_size: 4,
            selected_iterations: 1,
            selected_early_stopping_patience: 15,
            //Values selected currently on the form

            model_result_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/train_val_metrics_plot_experiment1.png',

            // model_name:'LR - '+ Date().toLocaleString("en-GB")
        };

        //Binding functions of the class
        this.fetchFileNames = this.fetchFileNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectDataChange = this.handleSelectDataChange.bind(this);
        this.handleSelectCsvChange = this.handleSelectCsvChange.bind(this);
        this.handleSelectLrChange = this.handleSelectLrChange.bind(this);
        this.handleSelectBatchSizeChange = this.handleSelectBatchSizeChange.bind(this);
        this.handleSelectIterationsChange = this.handleSelectIterationsChange.bind(this);
        this.handleSelectEarlyStoppingPatienceChange = this.handleSelectEarlyStoppingPatienceChange.bind(this);

        this.fetchFileNames();
    }
    /**
     * Process and send the request for auto correlation and handle the response
     */

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({LinearRegression_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("ai_mri_training_experiment", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                data_path: this.state.selected_lr,
                csv_path: this.state.csv_path,
                iterations : this.state.selected_iterations,
                batch_size: this.state.selected_batch_size,
                lr: this.state.selected_lr,
                early_stopping_patience: this.state.selected_early_stopping_patience
            },
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            this.setState({test_data: res.data})
            this.setState({LinearRegression_show: true})
            this.setState({dfslope:JSON.parse(res.data.slope)});
            this.setState({tabvalue:1})
        });
    }
    /**
     * Update state when selection changes in the form
     */
    async fetchFileNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_all_files",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({file_names: res.data.files})
        });
    }




    handleSelectDataChange(event) {
        this.setState({ selected_data: event.target.value });
    }

    handleSelectCsvChange(event) {
        this.setState({ selected_csv: event.target.value });
    }

    handleSelectLrChange(event) {
        this.setState({ selected_lr: event.target.value });
    }

    handleSelectBatchSizeChange(event) {
        this.setState({ selected_batch_size: event.target.value });
    }

    handleSelectIterationsChange(event) {
        this.setState({ selected_iterations: event.target.value });
    }

    handleSelectEarlyStoppingPatienceChange(event) {
        this.setState({ selected_early_stopping_patience: event.target.value });
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            MRI Model Training Parameterisation
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                            {/*    <InputLabel id="file-selector-label">File</InputLabel>*/}
                            {/*    <Select*/}
                            {/*            labelId="file-selector-label"*/}
                            {/*            id="file-selector"*/}
                            {/*            value= {this.state.selected_file_name}*/}
                            {/*            label="File Variable"*/}
                            {/*            onChange={this.handleSelectFileNameChange}*/}
                            {/*    >*/}
                            {/*        {this.state.file_names.map((column) => (*/}
                            {/*                <MenuItem value={column}>{column}</MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </Select>*/}
                            {/*    <FormHelperText>Select dataset.</FormHelperText>*/}
                            {/*</FormControl>*/}
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="data-selector-label">Data</InputLabel>
                                <Select
                                        labelId="data-selector-label"
                                        id="data-selector"
                                        value={this.state.selected_data}
                                        label="Data"
                                        onChange={this.handleSelectDataChange}
                                >
                                    {this.state.data_names.map((data) => (
                                            <MenuItem value={data}>{data}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select data.</FormHelperText>
                            </FormControl>

                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="csv-selector-label">CSV</InputLabel>
                                <Select
                                        labelId="csv-selector-label"
                                        id="csv-selector"
                                        value={this.state.selected_csv}
                                        label="CSV"
                                        onChange={this.handleSelectCsvChange}
                                >
                                    {this.state.csv_names.map((csv) => (
                                            <MenuItem value={csv}>{csv}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select CSV file.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="model-name-selector-label"
                                        id="model-name-selector"
                                        value= {this.state.selected_lr}
                                        label="Learning Rate"
                                        onChange={this.handleSelectLrChange}
                                />
                                <FormHelperText>Learning Rate: 0.001 Default , Suggested values 0.01 , 0.0001  learning rate is a tuning parameter in an optimization algorithm that determines the step size at each iteration while moving toward a minimum of a loss function </FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="model-name-selector-label"
                                        id="model-name-selector"
                                        value= {this.state.selected_batch_size}
                                        label="Batch Size"
                                        onChange={this.handleSelectBatchSizeChange}
                                />
                                <FormHelperText>Batch Size</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="model-name-selector-label"
                                        id="model-name-selector"
                                        value= {this.state.selected_iterations}
                                        label="Iterations"
                                        onChange={this.handleSelectIterationsChange}
                                />
                                <FormHelperText>Iterations</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="model-name-selector-label"
                                        id="model-name-selector"
                                        value= {this.state.selected_early_stopping_patience}
                                        label="Early Stopping Patience"
                                        onChange={this.handleSelectEarlyStoppingPatienceChange}
                                />
                                <FormHelperText> Early Stopping Patience</FormHelperText>
                            </FormControl>
                            <hr/>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        <ProceedButton></ProceedButton>

                        <br/>
                        <br/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                            Model Training Results
                        </Typography>
                        <hr className="result"/>
                        <div style={{alignSelf: 'center'}}>
                            <img src={this.state.model_result_path + "?random=" + new Date().getTime()}
                                    srcSet={this.state.model_result_path + "?random=" + new Date().getTime() +'?w=100&h=100&fit=crop&auto=format&dpr=2 2x'}
                                 loading="lazy"
                                 style={{zoom: '70%'}}
                            />
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default MRIModelTraining;
