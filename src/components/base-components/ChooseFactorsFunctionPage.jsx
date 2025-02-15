import React from 'react';
import API from "../../axiosInstance";
import InnerHTML from 'dangerously-set-html-content'
import PropTypes from 'prop-types';
import {
    Button, FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem, Select, TextField, Typography
} from "@mui/material";
import mpld3 from 'mpld3';
// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import EEGSelectModal from "../ui-components/EEGSelectModal";
import qs from "qs";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import ProceedButton from "../ui-components/ProceedButton";

const params = new URLSearchParams(window.location.search);

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

class ChooseFactorsFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],
            initialdataset:[],

            //Values selected currently on the form
            selected_use_smc: "True",
            selected_n_factors: "3",
            selected_rotation: "None",
            selected_method: "minres",
            selected_impute: "drop",
            selected_independent_variables: [],

            // Values returned from backend
            choose_factors_chart_data : [],
            correlation_matrix: [],
            df_orig_eigen_values: "",

            // path to visualisations sent from backend
            factor_eigen_path: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/factor_eigen_values.png',

            // Visualisation Hide/Show values
            choose_factors_show: false,
        };

        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectUseSmcChange = this.handleSelectUseSmcChange.bind(this);
        this.handleSelectNFactorsChange = this.handleSelectNFactorsChange.bind(this);
        this.handleSelectRotationChange = this.handleSelectRotationChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectImputeChange = this.handleSelectImputeChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.debug = this.debug.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchColumnNames();

        // Initialise component
        // - values of channels from the backend
        // this.fetchChannels();

    }
    debug = () => {
        console.log("DEBUG")
        console.log(this.state)
    };


    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();

        //Reset view of optional visualisations preview
        this.setState({choose_factors_chart_show: false})



        const params = new URLSearchParams(window.location.search);
        // Send the request
        API.get("choose_number_of_factors",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        use_smc: this.state.selected_use_smc, n_factors: this.state.selected_n_factors,
                        rotation: this.state.selected_rotation, method: this.state.selected_method,
                        impute: this.state.selected_impute, independent_variables: this.state.selected_independent_variables},
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')



            // console.log("")
            // console.log(temp_array)

            this.setState({df_orig_eigen_values: JSON.parse(resultJson['df_orig_eigen_values'])})
            this.setState({choose_factors_show: true})

        });
    }
    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({columns: res.data.columns})
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
    }
    clear(){
        this.setState({selected_independent_variables: []})
    }
    selectAll(){
        this.setState({selected_independent_variables: this.state.columns})
    }
    handleSelectUseSmcChange(event){
        this.setState( {selected_use_smc: event.target.value})
    }
    handleSelectNFactorsChange(event){
        this.setState( {selected_n_factors: event.target.value})
    }
    handleSelectRotationChange(event){
        this.setState( {selected_rotation: event.target.value})
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
    }
    handleSelectImputeChange(event){
        this.setState( {selected_impute: event.target.value})
    }


    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Choose Number of Factors Parameterisation
                        </Typography>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                            <FormHelperText>Selected Variables</FormHelperText>
                            <List style={{fontSize:'9px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                {this.state.selected_independent_variables.map((column) => (
                                        <ListItem disablePadding
                                        >
                                            <ListItemText
                                                    primaryTypographyProps={{fontSize: '10px'}}
                                                    primary={'•  ' + column}
                                            />
                                        </ListItem>
                                ))}
                            </List>
                        </FormControl>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Columns</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables}
                                        multiple
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariableChange}
                                >

                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Independent Variables</FormHelperText>
                                <Button onClick={this.selectAll}>
                                    Select All Variables
                                </Button>
                                <Button onClick={this.clear}>
                                    Clear Selections
                                </Button>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="use-smc-label">Use squared multiple correlation</InputLabel>
                                <Select
                                        labelId="use-smc-label"
                                        id="use-smc-selector"
                                        value= {this.state.selected_use_smc}
                                        label="use-smc"
                                        onChange={this.handleSelectUseSmcChange}
                                >
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                    <MenuItem value={"False"}><em>False</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify whether or not to use squared multiple correlation as starting guesses for factor analysis.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="n_factors-label"
                                        id="n_factors-selector"
                                        value= {this.state.selected_n_factors}
                                        label="n_factors"
                                        onChange={this.handleSelectNFactorsChange}
                                        type="number"
                                />
                                <FormHelperText>The number of factors to select. Selection must be a positive integer.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="rotation-label">Rotation</InputLabel>
                                <Select
                                        labelId="rotation-label"
                                        id="rotation-selector"
                                        value= {this.state.selected_rotation}
                                        label="rotation"
                                        onChange={this.handleSelectRotationChange}
                                >
                                    <MenuItem value={"None"}><em>None</em></MenuItem>
                                    <MenuItem value={"varimax"}><em>varimax</em></MenuItem>
                                    <MenuItem value={"promax"}><em>promax</em></MenuItem>
                                    <MenuItem value={"oblimin"}><em>oblimin</em></MenuItem>
                                    <MenuItem value={"oblimax"}><em>oblimax</em></MenuItem>
                                    <MenuItem value={"quartimin"}><em>quartimin</em></MenuItem>
                                    <MenuItem value={"quartimax"}><em>quartimax</em></MenuItem>
                                    <MenuItem value={"equamax"}><em>equamax</em></MenuItem>
                                    <MenuItem value={"geomin_obl"}><em>geomin_obl</em></MenuItem>
                                    <MenuItem value={"geomin_ort"}><em>geomin_ort</em></MenuItem>
                                </Select>
                                <FormHelperText>The type of rotation to perform after fitting the factor analysis model.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="method-label">Fitting Method</InputLabel>
                                <Select
                                        labelId="method-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="method"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    <MenuItem value={"minres"}><em>minres</em></MenuItem>
                                    <MenuItem value={"ml"}><em>ml</em></MenuItem>
                                    <MenuItem value={"principal"}><em>principal</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify the fitting method to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="impute-label">Imputation</InputLabel>
                                <Select
                                        labelId="impute-label"
                                        id="impute-selector"
                                        value= {this.state.selected_impute}
                                        label="impute"
                                        onChange={this.handleSelectImputeChange}
                                >
                                    <MenuItem value={"drop"}><em>drop</em></MenuItem>
                                    <MenuItem value={"mean"}><em>mean</em></MenuItem>
                                    <MenuItem value={"median"}><em>median</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify how to handle missing values.</FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        <ProceedButton></ProceedButton>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Choose Number of Factors Results
                        </Typography>
                        <hr/>
                        <div style={{display: (this.state.choose_factors_show ? 'block' : 'none')}}>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.choose_factors_show ? 'block' : 'none')  }}>
                                Original Eigenvalues
                            </Typography>
                            <JsonTable className="jsonResultsTable" rows = {this.state.df_orig_eigen_values}/>
                            <hr className="result" style={{display: (this.state.choose_factors_show ? 'block' : 'none')}}/>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.choose_factors_show ? 'block' : 'none')  }}>
                                Plotting of Eigenvalues vs Number of Factors
                            </Typography>
                            {/*<div style={{ display: (this.state.choose_factors_show ? 'block' : 'none') }}>*/}
                            {/*    <InnerHTML html={this.state.correlation_matrix}/>*/}
                            {/*    /!*<HistogramChartCustom chart_id="histogram_chart_id" chart_data={ this.state.test_chart_data}/>*!/*/}
                            {/*</div>*/}
                            <img style={{ display: (this.state.choose_factors_show ? 'block' : 'none'), alignItems: "center", justify:"center"}}
                                 src={this.state.factor_eigen_path + "?random=" + new Date().getTime()}/>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default ChooseFactorsFunctionPage;
