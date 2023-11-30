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
    Table, TableRow, TableCell, TableContainer, Paper, Tabs, Tab
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import qs from "qs";
import ChannelSignalSpindleSlowwaveChartCustom from "../ui-components/ChannelSignalSpindleSlowwaveChartCustom";
import ScatterPlot from "../ui-components/ScatterPlot";
import {DataGrid} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
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


class LinearRegressionFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            column_names: [],
            file_names:[],
            test_data: {
                Dataframe:""
            },

            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_independent_variables: [],
            selected_independent_variable: "",
            selected_regularization: "False",
            selected_file_name: "",

            influence_points: [],
            first_table: [],
            second_table: [],
            third_table: [],
            white_test: [],
            dep_variable: "",
            model: "",
            method: "",
            date: "",
            time: "",
            no_observations: "",
            df_resid: "",
            df_mod: "",
            cov_type: "",
            r_sq: "",
            adj_r_sq: "",
            f_stat: ",",
            prob_f: "",
            log_like: "",
            aic: "",
            bic: "",
            omnibus: "",
            prob_omni: "",
            skew: "",
            kurtosis: "",
            durbin: "",
            jb: "",
            prob_jb: "",
            cond: "",
            test_stat: "",
            test_stat_p: "",
            white_f_stat: "",
            white_prob_f: "",
            infl_cols: [],
            influence_dict: [],
            selected_x_axis: "",
            selected_y_axis: "",
            scatter_chart_data: [],
            bresuch_lagrange: "",
            bresuch_p_value: "",
            bresuch_f_value: "",
            bresuch_f_p_value: "",
            goldfeld_p_value:"",
            goldfeld_f_value:"",
            goldfeld_order:"",
            // Hide/show results
            LinearRegression_show : false,
            linear_regression_step2_show: false,
            status: ""


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        // this.handleSelectRegularizationChange = this.handleSelectRegularizationChange.bind(this);
        this.clear = this.clear.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleScatter = this.handleScatter.bind(this);

        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleSelectVariableNameChange = this.handleSelectVariableNameChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.handleSelectXAxisnChange = this.handleSelectXAxisnChange.bind(this);
        this.handleSelectYAxisnChange = this.handleSelectYAxisnChange.bind(this);

        this.fetchFileNames();
        this.fetchColumnNames();

    }

    // debug = () => {
    //     console.log("DEBUG")
    //     console.log(this.state)
    // };


    /**
     * Process and send the request for auto correlation and handle the response
     */

    async handleSubmit(event) {
        event.preventDefault();

        // let to_send_shrinkage_2 = null;
        // let to_send_shrinkage_3 = null;
        //
        // if (!!this.state.selected_shrinkage_2){
        //     to_send_shrinkage_2 = parseFloat(this.state.selected_shrinkage_2)
        // }
        // if (!!this.state.selected_shrinkage_3){
        //     to_send_shrinkage_3 = parseFloat(this.state.selected_shrinkage_3)
        // }

        this.setState({LinearRegression_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("linear_regressor_statsmodels", {
            params: {
                workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dependent_variable: this.state.selected_dependent_variable,
                independent_variables: this.state.selected_independent_variables,
                regularization: this.state.selected_regularization},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            const resultJson = res.data['Result'];
            const status = res.data['status'];
            console.log(resultJson)
            console.log(status)
            console.log('Test')



            // console.log("")
            // console.log(temp_array)
            this.setState({status: status})
            if (status === 'Success') {
                this.setState({influence_points: resultJson['DataFrame with all available influence results']})
                this.setState({first_table: resultJson['first_table']})
                this.setState({second_table: resultJson['second table']})
                this.setState({third_table: resultJson['third table']['Values']})
                this.setState({white_test: resultJson['dataframe white test']})
                this.setState({dep_variable: resultJson['dep']})
                this.setState({model: resultJson['model']})
                this.setState({method: resultJson['method']})
                this.setState({date: resultJson['date']})
                this.setState({time: resultJson['time']})
                this.setState({no_observations: resultJson['no_obs']})
                this.setState({df_resid: resultJson['resid']})
                this.setState({df_mod: resultJson['df_model']})
                this.setState({cov_type: resultJson['cov_type']})
                this.setState({r_sq: resultJson['r_squared']})
                this.setState({adj_r_sq: resultJson['adj_r_squared']})
                this.setState({f_stat: resultJson['f_stat']})
                this.setState({prob_f: resultJson['prob_f']})
                this.setState({log_like: resultJson['log_like']})
                this.setState({aic: resultJson['aic']})
                this.setState({bic: resultJson['bic']})
                this.setState({omnibus: resultJson['omnibus']})
                this.setState({prob_omni: resultJson['prob_omni']})
                this.setState({skew: resultJson['skew']})
                this.setState({kurtosis: resultJson['kurtosis']})
                this.setState({durbin: resultJson['durbin']})
                this.setState({jb: resultJson['jb']})
                this.setState({prob_jb: resultJson['prob_jb']})
                this.setState({cond: resultJson['cond']})
                this.setState({test_stat: resultJson['test_stat']})
                this.setState({test_stat_p: resultJson['test_stat_p']})
                this.setState({white_f_stat: resultJson['white_f_stat']})
                this.setState({white_prob_f: resultJson['white_prob_f']})
                this.setState({infl_cols: resultJson['influence_columns']})
                this.setState({influence_dict: resultJson['influence_dict']})
                this.setState({bresuch_lagrange: resultJson['bresuch_lagrange']})
                this.setState({bresuch_p_value: resultJson['bresuch_p_value']})
                this.setState({bresuch_f_value: resultJson['bresuch_f_value']})
                this.setState({bresuch_f_p_value: resultJson['bresuch_f_p_value']})
                this.setState({goldfeld_p_value: resultJson['Goldfeld-Quandt p-value']})
                this.setState({goldfeld_f_value: resultJson['Goldfeld-Quandt F-value']})
                this.setState({goldfeld_order: resultJson['Goldfeld-Quandt ordering used in the alternative']})

                this.setState({LinearRegression_show: true})
            }
            this.setState({tabvalue:1})


        });
        // const response = await fetch("http://localhost:8000/test/return_autocorrelation", {
        //     method: "GET",
        //     headers: {"Content-Type": "application/json"},
        //     // body: JSON.stringify({"name": this.state.selected_channel})
        //     // body: newTodo
        // })
        // // .then(response => updateResult(response.json()) )
        // const resultJson = await response.json()
        // // let temp_array = []
        // // for ( let it =0 ; it < resultJson.values_autocorrelation.length; it++){
        // //     let temp_object = {}
        // //     temp_object["order"] = it
        // //     temp_object["value"] = resultJson.values_autocorrelation[it]
        // //     temp_array.push(temp_object)
        // // }
        // // console.log(temp_array)
        // this.setState({correlation_results: resultJson.values_autocorrelation})
        this.setState.bind(this)
        console.log(this.state)
    }


    async handleScatter(event) {
        event.preventDefault();
        let temp_array = []
        for (let i = 0; i < this.state.influence_dict[this.state.selected_x_axis].length; i++) {
            let temp_object = {}

            temp_object["xValue"] = this.state.influence_dict[this.state.selected_x_axis][i]
            temp_object["yValue"] = this.state.influence_dict[this.state.selected_y_axis][i]

            temp_array.push(temp_object)
        }
        console.log(temp_array)
        this.setState({scatter_chart_data: temp_array})

        this.setState({linear_regression_step2_show: true})

    }
    /**
     * Update state when selection changes in the form
     */

    async fetchColumnNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({column_names: res.data.columns})
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
        window.location.replace("/")
    }
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        // this.setState( {selected_variable: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.setState({selected_independent_variables: []})
            this.setState({selected_independent_variable: ""})
            this.setState({selected_dependent_variable: ""})
            this.state.LinearRegression_show=false
            this.state.linear_regression_step2_show=false
        })
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleListDelete(event) {
        let newArray = this.state.selected_independent_variables.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_independent_variables:newList})
    }
    handleSelectVariableNameChange(event){
        this.setState( {selected_independent_variable: event.target.value})
        let newArray = this.state.selected_independent_variables.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables:newArray})
    }
    // handleSelectRegularizationChange(event){
    //     this.setState({selected_regularization: event.target.value})
    // }
    clear(){
        this.setState({selected_independent_variables: []})
    }

    handleSelectXAxisnChange(event){
        this.setState({selected_x_axis: event.target.value})
    }
    handleSelectYAxisnChange(event){
        this.setState({selected_y_axis: event.target.value})
    }

    render() {
        return (
                <Grid container direction="row">
                    {/*<Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>*/}
                    {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                    {/*        Available Variables*/}
                    {/*    </Typography>*/}

                    {/*    <hr/>*/}
                    {/*    <List>*/}
                    {/*        {this.state.columns.map((column) => (*/}
                    {/*                <ListItem> <ListItemText primary={column}/></ListItem>*/}
                    {/*        ))}*/}
                    {/*    </List>*/}
                    {/*</Grid>*/}
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Linear Regression Parameterisation
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
                                <InputLabel id="dependent-variable-selector-label">Dependent Variable</InputLabel>
                                <Select
                                        labelId="dependent-variable-selector-label"
                                        id="dependent-variable-selector"
                                        value= {this.state.selected_dependent_variable}
                                        label="Dependent Variable"
                                        onChange={this.handleSelectDependentVariableChange}
                                >

                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Dependent Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Independent Variables</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variable}
                                        label="Column"
                                        onChange={this.handleSelectVariableNameChange}
                                >

                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Independent Variables</FormHelperText>
                            </FormControl>
                            {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                            {/*    <InputLabel id="regularization-label">Regularization</InputLabel>*/}
                            {/*    <Select*/}
                            {/*            labelId="regularization-label"*/}
                            {/*            id="regularization-selector"*/}
                            {/*            value= {this.state.selected_regularization}*/}
                            {/*            label="regularization"*/}
                            {/*            onChange={this.handleSelectRegularizationChange}*/}
                            {/*    >*/}
                            {/*        /!*<MenuItem value={"none"}><em>None</em></MenuItem>*!/*/}
                            {/*        <MenuItem value={"False"}><em>False</em></MenuItem>*/}
                            {/*        <MenuItem value={"True"}><em>True</em></MenuItem>*/}
                            {/*    </Select>*/}
                            {/*    <FormHelperText>Select if you want to add regularization</FormHelperText>*/}
                            {/*</FormControl>*/}
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_dependent_variable && !this.state.selected_independent_variables}>
                                {/*|| !this.state.selected_method*/}
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.LinearRegression_show}>
                                Proceed >
                            </Button>
                        </form>
                            <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                                <FormHelperText>Selected independent variables [click to remove]</FormHelperText>
                                <div>
                                <span>
                                    {this.state.selected_independent_variables.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleListDelete}>
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                                </div>
                                <Button onClick={this.clear}>
                                    Clear All
                                </Button>
                            </FormControl>
                        <br/>
                        <br/>
                        <div  style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>
                            <hr style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}/>
                            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                Available Variables
                            </Typography>
                            <form onSubmit={this.handleScatter}>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="x-axis-selector-label">Select X-axis</InputLabel>
                                    <Select
                                            labelId="x-axis-selector-label"
                                            id="x-axis-selector"
                                            value= {this.state.selected_x_axis}
                                            label="x-axis"
                                            onChange={this.handleSelectXAxisnChange}
                                    >

                                        {this.state.infl_cols.map((column) => (
                                                <MenuItem value={column}>
                                                    {column}
                                                </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Select Variable for X axis of scatterplot</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="y-axis-selector-label">Select Y-axis</InputLabel>
                                    <Select
                                            labelId="y-axis-selector-label"
                                            id="y-axis-selector"
                                            value= {this.state.selected_y_axis}
                                            label="y-axis"
                                            onChange={this.handleSelectYAxisnChange}
                                    >

                                        {this.state.infl_cols.map((column) => (
                                                <MenuItem value={column}>
                                                    {column}
                                                </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Select Variable for Y axis of scatterplot</FormHelperText>
                                </FormControl>
                                <Button variant="contained" color="primary" type="submit">
                                    Submit
                                </Button>
                            </form>
                            <div style={{ display: (this.state.linear_regression_step2_show ? 'block' : 'none') }}>
                                <ScatterPlot chart_id="scatter_chart_id"  chart_data={this.state.scatter_chart_data}/>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Linear Regression Results
                        </Typography>
                        <hr className="result"/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}
                        {/*<div style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.first_table}} />*/}
                        {/*<hr style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }}/>*/}
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    <Tab label="New Dataset" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.initialdataset}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <div style={{display: (this.state.status === 'Success' ? 'block': 'none')}}>
                                    <div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>
                                        <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                            <Table>
                                                <TableRow>
                                                    <TableCell><strong>Dependent Variable:</strong></TableCell>
                                                    <TableCell>{this.state.dep_variable}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Model:</strong></TableCell>
                                                    <TableCell>{this.state.model}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Method:</strong></TableCell>
                                                    <TableCell>{this.state.method}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Date:</strong></TableCell>
                                                    <TableCell>{this.state.date}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Time:</strong></TableCell>
                                                    <TableCell>{this.state.time}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>No. Observations:</strong></TableCell>
                                                    <TableCell>{this.state.no_observations}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Df Residuals:</strong></TableCell>
                                                    <TableCell>{this.state.df_resid}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Df Model:</strong></TableCell>
                                                    <TableCell>{this.state.df_mod}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Covariance Type:</strong></TableCell>
                                                    <TableCell>{this.state.cov_type}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>R-squared:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.r_sq).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Adjusted R-squared:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.adj_r_sq).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>F-statistic:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.f_stat).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Prob (F-statistic):</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.prob_f).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Log-Likelihood:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.log_like).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>AIC:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.aic).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>BIC:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.bic).toFixed(5)}</TableCell>
                                                </TableRow>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                    <hr className="result" style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}/>
                                    <div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>
                                        <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                            <Table>
                                                <TableRow>
                                                    <TableCell><strong>Omnnibus:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.omnibus).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Prob(Omnibus):</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.prob_omni).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Skew:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.skew).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Kurtosis:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.kurtosis).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Durbin-Watson:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.durbin).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Jarque-Bera (JB):</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.jb).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Prob(JB):</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.prob_jb).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Cond. No.:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.cond).toFixed(5)}</TableCell>
                                                </TableRow>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                    <hr className="result" style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}/>
                                    <br/>
                                    <div className="result" style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}
                                         dangerouslySetInnerHTML={{__html: this.state.second_table}}/>
                                    <br/>
                                    <hr className="result" style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}/>
                                    <div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>
                                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                            White test (test for heteroscedasticity)
                                        </Typography>
                                        <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                            <Table>
                                                <TableRow>
                                                    <TableCell><strong>Test Statistic:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.test_stat).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Test Statistic p-value:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.test_stat_p).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>F-Statistic:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.white_f_stat).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>F-Test p-value:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.white_prob_f).toFixed(5)}</TableCell>
                                                </TableRow>
                                            </Table>
                                        </TableContainer>
                                        <hr className="result"/>
                                        <div>
                                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                                Goldfeld-Quandt (test for heteroscedasticity)
                                            </Typography>
                                            <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                                <Table>
                                                    <TableRow>
                                                        <TableCell><strong>Goldfeld-Quandt p-value:</strong></TableCell>
                                                        <TableCell>{Number.parseFloat(this.state.goldfeld_p_value).toFixed(5)}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Goldfeld-Quandt F-Statistic:</strong></TableCell>
                                                        <TableCell>{Number.parseFloat(this.state.goldfeld_f_value).toFixed(5)}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Goldfeld-Quandt ordering used in the alternative</strong></TableCell>
                                                        <TableCell>{this.state.goldfeld_order}</TableCell>
                                                    </TableRow>
                                                </Table>
                                            </TableContainer>
                                        </div>
                                        <hr className="result"/>
                                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                            Breusch-Pagan test (test for heteroscedasticity)
                                        </Typography>
                                        <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                            <Table>
                                                <TableRow>
                                                    <TableCell><strong>Lagrange Multiplier Statistic:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.bresuch_lagrange).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Lagrange Multiplier Statistic p-value:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.bresuch_p_value).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>F-Statistic:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.bresuch_f_value).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>F-Test p-value:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.bresuch_f_p_value).toFixed(5)}</TableCell>
                                                </TableRow>
                                            </Table>
                                        </TableContainer>
                                        <hr className="result"/>


                                        <hr/>
                                    </div>
                                </div>
                                <div style={{display: (this.state.status !== 'Success' ? 'block': 'none')}}>
                                    <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                        <Table>
                                            <TableRow>
                                                <TableCell>{this.state.status}</TableCell>
                                            </TableRow>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                <div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}} dangerouslySetInnerHTML={{__html: this.state.influence_points}} />
                            </TabPanel>
                        </Box>



                        {/*<div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>*/}
                        {/*    <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>*/}
                        {/*        <Table>*/}
                        {/*            /!*{this.state.columns.map((column) => (*!/*/}
                        {/*            /!*        <MenuItem value={column}>*!/*/}
                        {/*            /!*            {column}*!/*/}
                        {/*            /!*        </MenuItem>*!/*/}
                        {/*            /!*))}*!/*/}
                        {/*            {console.log(typeof (this.state.third_table))}*/}
                        {/*            {this.state.third_table.map((object) => (*/}
                        {/*                <TableRow>*/}
                        {/*                    <TableCell><strong>{object}</strong></TableCell>*/}
                        {/*                    /!*<TableCell>{Number.parseFloat({i}).toFixed(5)}</TableCell>*!/*/}
                        {/*                </TableRow>*/}
                        {/*            ))}*/}
                        {/*        </Table>*/}
                        {/*    </TableContainer>*/}
                        {/*</div>*/}

                    </Grid>
                </Grid>
        )
    }
}

export default LinearRegressionFunctionPage;
