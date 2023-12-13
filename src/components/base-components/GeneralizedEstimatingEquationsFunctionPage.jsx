import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem, Paper,
    Select, Tab, Table, TableCell, TableContainer, TableRow, Tabs, TextareaAutosize, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import qs from "qs";
import ScatterPlot from "../ui-components/ScatterPlot";
import "../../pages/hypothesis_testing/normality_tests.scss"
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

class GeneralizedEstimatingEquationsFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],
            initialdataset:[],
            file_names:[],
            output_return_data: [],

            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_group: "",
            selected_independent_variable: "",
            selected_independent_variables: [],
            selected_cov_struct: "independence",
            selected_family: "poisson",

            first_table: "",
            second_table: "",
            third_table: "",
            scatter_chart_data: [],
            selected_x_axis: "",
            selected_y_axis: "",

            // Hide/show results
            GeneralizedEstimatingEquations_show : false,
            GeneralizedEstimatingEquations_step2_show: false


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectCovStructChange = this.handleSelectCovStructChange.bind(this);
        this.handleSelectFamilyChange = this.handleSelectFamilyChange.bind(this);
        this.handleSelectGroupChange = this.handleSelectGroupChange.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleScatter = this.handleScatter.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleSelectVariableNameChange = this.handleSelectVariableNameChange.bind(this);

        this.handleSelectXAxisnChange = this.handleSelectXAxisnChange.bind(this);
        this.handleSelectYAxisnChange = this.handleSelectYAxisnChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchColumnNames();
        this.fetchFileNames();

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

        this.setState({GeneralizedEstimatingEquations_show: false})



        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("generalized_estimating_equations", {
            params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dependent_variable: this.state.selected_dependent_variable,
                groups: this.state.selected_group,
                family: this.state.selected_family,
                cov_struct: this.state.selected_cov_struct,
                independent_variables: this.state.selected_independent_variables},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')



            // console.log("")
            // console.log(temp_array)


            this.setState({first_table: JSON.parse(resultJson['first_table'])})
            this.setState({second_table: JSON.parse(resultJson['second_table'])})
            this.setState({third_table: JSON.parse(resultJson['third_table'])})

            this.setState({GeneralizedEstimatingEquations_show: true})
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
        console.log(this.state.values_dict)
        for (let i = 0; i < this.state.values_dict[this.state.selected_x_axis].length; i++) {
            let temp_object = {}

            temp_object["xValue"] = this.state.values_dict[this.state.selected_x_axis][i]
            temp_object["yValue"] = this.state.values_dict[this.state.selected_y_axis][i]

            temp_array.push(temp_object)
        }
        console.log(temp_array)
        this.setState({scatter_chart_data: temp_array})

        this.setState({GeneralizedEstimatingEquations_step2_show: false})

    }



    /**
     * Update state when selection changes in the form
     */

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({columns: res.data.columns})
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
            this.setState({tabvalue:0})
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
        this.setState({selected_dependent_variable: event.target.value})
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.setState({selected_independent_variables: []})
            this.setState({selected_independent_variable: ""})
            this.setState({selected_dependent_variable: ""})
            this.state.GeneralizedEstimatingEquations_show=false
            this.state.GeneralizedEstimatingEquations_step2_show=false
        })
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

    handleSelectGroupChange(event){
        this.setState({selected_group: event.target.value})
    }

    handleSelectCovStructChange(event){
            this.setState({selected_cov_struct: event.target.value})
    }
    handleSelectFamilyChange(event){
            this.setState({selected_family: event.target.value})
    }

    clear(){
        this.setState({selected_independent_variables: []})
    }
    selectAll(){
        this.setState({selected_independent_variables: this.state.columns})
    }

    handleSelectXAxisnChange(event){
        this.setState({selected_x_axis: event.target.value})
    }
    handleSelectYAxisnChange(event){
        this.setState({selected_y_axis: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }


    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Generalized Estimating Equations Parameterisation
                        </Typography>
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

                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Dependent Variable (Categorical)</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Columns</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variable}
                                        label="Column"
                                        onChange={this.handleSelectVariableNameChange}
                                >

                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Independent Variables</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="group-selector-label">Group</InputLabel>
                                <Select
                                        labelId="group-selector-label"
                                        id="group"
                                        value= {this.state.selected_group}
                                        label="group"
                                        onChange={this.handleSelectGroupChange}
                                >

                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Group</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="CovStruct-label">Covariance Structure</InputLabel>
                                <Select
                                        labelId="CovStruct-label"
                                        id="CovStruct-selector"
                                        value= {this.state.selected_cov_struct}
                                        label="CovStruct"
                                        onChange={this.handleSelectCovStructChange}
                                >
                                    <MenuItem value={"independence"}><em>independence</em></MenuItem>
                                    <MenuItem value={"autoregressive"}><em>autoregressive</em></MenuItem>
                                    <MenuItem value={"exchangeable"}><em>exchangeable</em></MenuItem>
                                    <MenuItem value={"nested_working_dependence"}><em>nested working dependence</em></MenuItem>
                                </Select>
                                <FormHelperText>Select Covariance Structure</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="Family-label">Family</InputLabel>
                                <Select
                                        labelId="Family-label"
                                        id="Family-selector"
                                        value= {this.state.selected_family}
                                        label="Family"
                                        onChange={this.handleSelectFamilyChange}
                                >
                                    <MenuItem value={"poisson"}><em>poisson</em></MenuItem>
                                    <MenuItem value={"gamma"}><em>gamma</em></MenuItem>
                                    <MenuItem value={"gaussian"}><em>gaussian</em></MenuItem>
                                    <MenuItem value={"inverse_gaussian"}><em>inverse gaussian</em></MenuItem>
                                    <MenuItem value={"negative_binomial"}><em>negative binomial</em></MenuItem>
                                    <MenuItem value={"binomial"}><em>binomial</em></MenuItem>
                                    <MenuItem value={"tweedie"}><em>tweedie</em></MenuItem>
                                </Select>
                                <FormHelperText>Select Family</FormHelperText>
                            </FormControl>



                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_dependent_variable && !this.state.selected_independent_variables}>
                                {/*|| !this.state.selected_method*/}
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.GeneralizedEstimatingEquations_show}>
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
                        {/*<div  style={{display: (this.state.GeneralizedEstimatingEquations_show ? 'block' : 'none')}}>*/}
                        {/*    <hr style={{display: (this.state.GeneralizedEstimatingEquations_show ? 'block' : 'none')}}/>*/}
                        {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                        {/*        Available Variables*/}
                        {/*    </Typography>*/}
                        {/*    <form onSubmit={this.handleScatter}>*/}
                        {/*        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                        {/*            <InputLabel id="x-axis-selector-label">Select X-axis</InputLabel>*/}
                        {/*            <Select*/}
                        {/*                    labelId="x-axis-selector-label"*/}
                        {/*                    id="x-axis-selector"*/}
                        {/*                    value= {this.state.selected_x_axis}*/}
                        {/*                    label="x-axis"*/}
                        {/*                    onChange={this.handleSelectXAxisnChange}*/}
                        {/*            >*/}

                        {/*                {this.state.values_columns.map((column) => (*/}
                        {/*                        <MenuItem value={column}>*/}
                        {/*                            {column}*/}
                        {/*                        </MenuItem>*/}
                        {/*                ))}*/}
                        {/*            </Select>*/}
                        {/*            <FormHelperText>Select Variable for X axis of scatterplot</FormHelperText>*/}
                        {/*        </FormControl>*/}
                        {/*        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                        {/*            <InputLabel id="y-axis-selector-label">Select Y-axis</InputLabel>*/}
                        {/*            <Select*/}
                        {/*                    labelId="y-axis-selector-label"*/}
                        {/*                    id="y-axis-selector"*/}
                        {/*                    value= {this.state.selected_y_axis}*/}
                        {/*                    label="y-axis"*/}
                        {/*                    onChange={this.handleSelectYAxisnChange}*/}
                        {/*            >*/}

                        {/*                {this.state.values_columns.map((column) => (*/}
                        {/*                        <MenuItem value={column}>*/}
                        {/*                            {column}*/}
                        {/*                        </MenuItem>*/}
                        {/*                ))}*/}
                        {/*            </Select>*/}
                        {/*            <FormHelperText>Select Variable for Y axis of scatterplot</FormHelperText>*/}
                        {/*        </FormControl>*/}
                        {/*        <Button variant="contained" color="primary" type="submit">*/}
                        {/*            Submit*/}
                        {/*        </Button>*/}
                        {/*    </form>*/}
                        {/*    <div style={{ display: (this.state.GeneralizedEstimatingEquations_step2_show ? 'block' : 'none') }}>*/}
                        {/*        <ScatterPlot chart_id="scatter_chart_id"  chart_data={this.state.scatter_chart_data}/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </Grid>
                    <Grid  item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Generalized Estimating Equations Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        {/*<div style={{ display: (this.state.GeneralizedEstimatingEquations_show ? 'block' : 'none') }}>{this.state.coefficients}</div>*/}
                        {/*<div style={{ display: (this.state.GeneralizedEstimatingEquations_show ? 'block' : 'none') }}>{this.state.intercept}</div>*/}
                        {/*<div style={{ display: (this.state.GeneralizedEstimatingEquations_show ? 'block' : 'none') }}>{this.state.dataframe}</div>*/}
                        {/*<hr style={{ display: (this.state.GeneralizedEstimatingEquations_show ? 'block' : 'none') }}/>*/}
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                        <Tab label="Initial Dataset" {...a11yProps(0)} />
                                        <Tab label="Results" {...a11yProps(1)} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={this.state.tabvalue} index={0}>
                                    <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                                </TabPanel>
                                <TabPanel value={this.state.tabvalue} index={1}>
                                    <Grid container direction="row">
                                        <Grid sx={{ flexGrow: 1, textAlign: "center"}} >
                                            <div style={{ display: (this.state.GeneralizedEstimatingEquations_show ? 'block' : 'none')}}>
                                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, padding:'20px'}} >
                                                    GEE Regression Results
                                                </Typography>
                                                <JsonTable className="jsonResultsTable" rows = {this.state.first_table}/>
                                                <JsonTable className="jsonResultsTable" rows = {this.state.second_table}/>
                                                <JsonTable className="jsonResultsTable" rows = {this.state.third_table}/>
                                                {/*<div dangerouslySetInnerHTML={{__html: this.state.test_data.coefficients}} />*/}
                                            </div>
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                            </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default GeneralizedEstimatingEquationsFunctionPage;
