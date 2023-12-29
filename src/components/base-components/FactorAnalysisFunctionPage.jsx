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

class FactorAnalysisFunctionPage extends React.Component {
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
            columns: [],
            initialdataset:[],
            file_names:[],
            Results:"",

            //Values selected currently on the form
            selected_use_smc: "True",
            selected_n_factors: "3",
            selected_rotation: "None",
            selected_method: "minres",
            selected_impute: "drop",
            selected_independent_variables: [],
            selected_independent_variables_wf: [],
            // Values returned from backend
            factor_analysis_chart_data : [],
            correlation_matrix: [],
            df_com_eigen: "",
            df_factor_variances: "",
            df_new_dataset: "",
            df_structure: "",
            df_rotation: "",
            rotation: "",
            factor_corr_matrix: [],
            // path to visualisations sent from backend
            corr_path: ip + 'static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/correlation_matrix.png',
            factor_corr_path: ip + 'static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/factor_correlation_matrix.png',

            factor_loadings: "",

            // Visualisation Hide/Show values
            factor_analysis_show : false,
            test_chart_html: [],
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
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.debug = this.debug.bind(this);
        // Initialise component
        // - values of channels from the backend
        // this.fetchColumnNames();
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchFileNames();

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
        this.setState({factor_analysis_chart_show: false})
        const params = new URLSearchParams(window.location.search);
        // Send the request
        API.get("calculate_factor_analysis",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        use_smc: this.state.selected_use_smc, n_factors: this.state.selected_n_factors,
                        rotation: this.state.selected_rotation, method: this.state.selected_method,
                        impute: this.state.selected_impute, independent_variables: this.state.selected_independent_variables_wf.length >0 ? this.state.selected_independent_variables_wf : null
                    },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')

            this.setState({rotation: resultJson["Result"]['rotation']})
            this.setState({factor_loadings: JSON.parse(resultJson["Result"]['factor_matrix'])})
            this.setState({factor_analysis_show: true})
            this.setState({correlation_matrix: resultJson["Result"]['corr_matrix']})
            this.setState({df_com_eigen: JSON.parse(resultJson["Result"]['df_com_eigen'])})
            this.setState({df_factor_variances: JSON.parse(resultJson["Result"]['df_factor_variances'])})
            this.setState({df_new_dataset: JSON.parse(resultJson["Result"]['df_new_dataset'])})
            this.setState({df_structure: JSON.parse(resultJson["Result"]['df_structure'])})
            this.setState({df_rotation: JSON.parse(resultJson["Result"]['df_rotation'])})
            this.setState({factor_corr_matrix: resultJson["Result"]['factor_corr_matrix']})
            this.setState({factor_analysis_show: true})
        });
    }
    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({columns: res.data.columns})
        });
    }
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
    async fetchDatasetContent() {
        const params = new URLSearchParams(window.location.search);
        API.get("return_dataset",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
            this.setState({tabvalue:0})
        });
    }
    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        console.log(this.state.output_return_data);
        window.location.replace("/")
    }
    /**
     * Update state when selection changes in the form
     */
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
        var newArray = this.state.selected_independent_variables_wf.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables_wf:newArray})
    }
    handleListDelete(event) {
        var newArray = this.state.selected_independent_variables_wf.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_independent_variables_wf:newList})
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
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleDeleteVariable(event) {
        this.setState({selected_independent_variables_wf:[]})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.handleDeleteVariable()
            this.setState({stats_show: false})
        })
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Factor Analysis Parameterisation
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="file-selector-label">File</InputLabel>
                                <Select
                                        labelId="file-selector-label"
                                        id="file-selector"
                                        value= {this.state.selected_file_name}
                                        label="File Variable"
                                        onChange={this.handleSelectFileNameChange}
                                >
                                    {this.state.file_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select dataset.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Columns</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables}
                                        // multiple
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
                        <br/>
                        <br/>
                        <hr/>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected Independent variables [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_independent_variables_wf.map((column) => (
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
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Factor Analysis Result
                        </Typography>
                        <hr/>
                        <div style={{display: (this.state.factor_analysis_show ? 'block' : 'none')}}>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.factor_analysis_show ? 'block' : 'none')  }}>
                                Factor Loadings
                            </Typography>
                            <JsonTable className="jsonResultsTable" rows = {this.state.factor_loadings}/>
                            <hr className="result" style={{display: (this.state.factor_analysis_show ? 'block' : 'none')}}/>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.factor_analysis_show ? 'block' : 'none')  }}>
                                Correlation Matrix
                            </Typography>
                            {/*<div style={{ display: (this.state.factor_analysis_show ? 'block' : 'none') }}>*/}
                            {/*    <InnerHTML html={this.state.correlation_matrix}/>*/}
                            {/*    /!*<HistogramChartCustom chart_id="histogram_chart_id" chart_data={ this.state.test_chart_data}/>*!/*/}
                            {/*</div>*/}
                            <img style={{ display: (this.state.factor_analysis_show ? 'block' : 'none'), alignItems: "center", justify:"center"}}
                                 src={this.state.corr_path + "?random=" + new Date().getTime()}/>
                            <div style={{display: (this.state.rotation !== 'None' ? 'block' : 'none')}}>
                                <hr className="result"
                                    style={{display: (this.state.factor_analysis_show ? 'block' : 'none')}}/>
                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.factor_analysis_show ? 'block' : 'none')  }}>
                                    Rotation Matrix
                                </Typography>
                                <JsonTable className="jsonResultsTable" rows = {this.state.df_rotation}/>
                                <div style={{display: (['promax', 'oblimin', 'quartimin'].includes(this.state.rotation) ? 'block' : 'none')}}>
                                    <hr className="result"
                                        style={{display: (this.state.factor_analysis_show ? 'block' : 'none')}}/>
                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.factor_analysis_show ? 'block' : 'none')  }}>
                                        Factor Correlation Matrix
                                    </Typography>
                                    <img style={{ display: (this.state.factor_analysis_show ? 'block' : 'none'), alignSelf: 'center' }}
                                         src={this.state.factor_corr_path + "?random=" + new Date().getTime()}/>
                                    {/*<InnerHTML html={this.state.factor_corr_matrix}/>*/}
                                    <div style={{display: (this.state.rotation === 'promax' ? 'block' : 'none')}}>
                                        <hr className="result"
                                            style={{display: (this.state.factor_analysis_show ? 'block' : 'none')}}/>
                                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.factor_analysis_show ? 'block' : 'none')  }}>
                                            Structure Loading Matrix
                                        </Typography>
                                        <JsonTable className="jsonResultsTable" rows = {this.state.df_structure}/>
                                    </div>
                                </div>
                            </div>
                            {/*<div style={{display: (!['oblique', 'None', 'promax'].includes(this.state.rotation) ? 'block' : 'none')}}>*/}
                            {/*    <hr/>*/}
                            {/*    <JsonTable className="jsonResultsTable" rows = {this.state.df_rotation}/>*/}
                            {/*</div>*/}
                            <hr  class="result" style={{ display: (this.state.factor_analysis_show ? 'block' : 'none') }}/>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.factor_analysis_show ? 'block' : 'none')  }}>
                                Communalities, Eigenvalues and Uniquenesses, given the factor loading matrix
                            </Typography>
                            <JsonTable className="jsonResultsTable" rows = {this.state.df_com_eigen}/>
                            <hr  class="result" style={{ display: (this.state.factor_analysis_show ? 'block' : 'none') }}/>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.factor_analysis_show ? 'block' : 'none')  }}>
                                Factor Variance Information
                            </Typography>
                            <JsonTable className="jsonResultsTable" rows = {this.state.df_factor_variances}/>
                            <hr  class="result" style={{ display: (this.state.factor_analysis_show ? 'block' : 'none') }}/>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.factor_analysis_show ? 'block' : 'none')  }}>
                                Latent Variables
                            </Typography>
                            <JsonTable className="jsonResultsTable" rows = {this.state.df_new_dataset}/>
                            <hr className="result" style={{display: (this.state.factor_analysis_show ? 'block' : 'none')}}/>




                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default FactorAnalysisFunctionPage;
