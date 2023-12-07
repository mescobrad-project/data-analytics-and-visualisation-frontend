import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import "./normality_tests.scss"
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from "@mui/material";

import qs from "qs";
import Paper from "@mui/material/Paper";
import InnerHTML from "dangerously-set-html-content";
import ProceedButton from "../../components/ui-components/ProceedButton";

class SurvivalAnalysisCoxRegression extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],
            binary_columns: [],
            //Values selected currently on the form
            selected_covariates: "",
            selected_alpha: 0.05,
            selected_penalizer: 0,
            selected_l1_ratio: 0,
            selected_n_baseline_knots: 2,
            selected_breakpoints: 0,
            selected_duration_col: "",
            selected_event_col: "",
            selected_weights_col: "",
            selected_cluster_col: "",
            selected_entry_col: "",
            selected_strata: [],
            selected_values: [],
            selected_hazard_ratios: "False",
            selected_baseline_estimation_method: 'breslow',

            test_data:{
                Concordance_Index: [],
                AIC: [],
                Dataframe: [],
                figure:[],
                proportional_hazard_test:[]
            },
            // Hide/show results
            cox_show : false,
        };
        //Binding functions of the class
        // this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectCovariatesChange = this.handleSelectCovariatesChange.bind(this);
        this.handleSelectStrataVariableChange = this.handleSelectStrataVariableChange.bind(this);

        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectHazardRatiosChange = this.handleSelectHazardRatiosChange.bind(this);
        this.handleSelectPenalizerChange= this.handleSelectPenalizerChange.bind(this);
        this.handleSelectL1RatioChange= this.handleSelectL1RatioChange.bind(this);
        this.handleSelectNBaselineKnotsChange= this.handleSelectNBaselineKnotsChange.bind(this);
        this.handleSelectBreakpointsChange= this.handleSelectBreakpointsChange.bind(this);
        this.handleSelectDurationColChange= this.handleSelectDurationColChange.bind(this);
        this.handleSelectEventColChange= this.handleSelectEventColChange.bind(this);
        this.handleSelectWeightsColChange= this.handleSelectWeightsColChange.bind(this);
        this.handleSelectClusterColChange= this.handleSelectClusterColChange.bind(this);
        this.handleSelectEntryColChange= this.handleSelectEntryColChange.bind(this);
        this.handleSelectValuesChange= this.handleSelectValuesChange.bind(this);
        this.handleSelectBaselineEstimationMethodChange= this.handleSelectBaselineEstimationMethodChange.bind(this);

        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.debug = this.debug.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchColumnNames();
        this.fetchBinaryColumnNames();
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
        this.setState({cox_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("cox_regression", {
            params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                duration_col: this.state.selected_duration_col,
                covariates: this.state.selected_covariates,
                alpha: this.state.selected_alpha,
                penalizer: this.state.selected_penalizer,
                l1_ratio: this.state.selected_l1_ratio,
                n_baseline_knots: this.state.selected_n_baseline_knots,
                breakpoints: this.state.selected_breakpoints,
                // event_col: this.state.selected_event_col,
                // weights_col: this.state.selected_weights_col,
                // cluster_col: this.state.selected_cluster_col,
                // entry_col: this.state.selected_entry_col,
                // strata: this.state.selected_strata,
                values: this.state.selected_values,
                hazard_ratios: this.state.selected_hazard_ratios,
                baseline_estimation_method:this.state.selected_baseline_estimation_method
            },
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            this.setState({test_data: res.data})
            this.state.cox_show=true
        });
    }

    /**
     * Update state when selection changes in the form
     */

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            // console.log(res.data.columns)
            this.setState({columns: res.data.columns})
        });
    }

    async fetchBinaryColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_binary_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            // console.log(res.data.columns)
            this.setState({binary_columns: res.data.columns})
        });
    }

    // handleSelectDependentVariableChange(event){
    //     this.setState( {selected_dependent_variable: event.target.value})
    // }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }
    handleSelectHazardRatiosChange(event){
        this.setState( {selected_hazard_ratios: event.target.value})
    }
    handleSelectCovariatesChange(event){
        this.setState( {selected_covariates: event.target.value})
    }
    handleSelectPenalizerChange(event){
        this.setState( {selected_penalizer: event.target.value})
    }
    handleSelectL1RatioChange(event){
        this.setState( {selected_l1_ratio: event.target.value})
    }
    handleSelectNBaselineKnotsChange(event){
        this.setState( {selected_n_baseline_knots: event.target.value})
    }
    handleSelectBreakpointsChange(event){
        this.setState( {selected_breakpoints: event.target.value})
    }
    handleSelectEventColChange(event){
        this.setState( {selected_event_col: event.target.value})
    }
    handleSelectDurationColChange(event){
        this.setState( {selected_duration_col: event.target.value})
    }
    handleSelectWeightsColChange(event){
        this.setState( {selected_weights_col: event.target.value})
    }
    handleSelectClusterColChange(event){
        this.setState( {selected_cluster_col: event.target.value})
    }
    handleSelectEntryColChange(event){
        this.setState( {selected_entry_col: event.target.value})
    }
    handleSelectStrataVariableChange(event){
        this.setState( {selected_strata: event.target.value})
    }
    handleSelectValuesChange(event){
        this.setState( {selected_values: event.target.value})
    }
    handleSelectBaselineEstimationMethodChange(event){
        this.setState( {baseline_estimation_method: event.target.value})
    }
    clear(){
        this.setState({selected_covariates: []})
    }
    clearStrata(){
        this.setState({selected_strata: []})
    }
    selectAll(){
        this.setState({selected_covariates: this.state.columns})
    }

    render() {

        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Linear Mixed Effects Model Parameterisation
                        </Typography>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                            <FormHelperText>Selected Variables</FormHelperText>
                            <List style={{fontSize:'9px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                {this.state.selected_strata.map((column) => (
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
                                <InputLabel id="covariates-label">Covariates</InputLabel>
                                <Select
                                        labelId="covariates-label"
                                        id="covariates-selector"
                                        value= {this.state.selected_covariates}
                                        label="Covariates"
                                        onChange={this.handleSelectCovariatesChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select the covariate(s) in the original dataset that we wish to vary.</FormHelperText>
                                {/*<Button onClick={this.selectAll}>*/}
                                {/*    Select All Variables*/}
                                {/*</Button>*/}
                                {/*<Button onClick={this.clear}>*/}
                                {/*    Clear Selections*/}
                                {/*</Button>*/}
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="duration_col-selector-label">duration_col</InputLabel>
                                <Select
                                        labelId="duration_col-selector-label"
                                        id="duration_col-selector"
                                        value= {this.state.selected_duration_col}
                                        label="duration_col"
                                        onChange={this.handleSelectDurationColChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select the name of the column in DataFrame that contains the subjects’ lifetimes.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="alpha-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="alpha"
                                        onChange={this.handleSelectAlphaChange}
                                        type="number"
                                />
                                <FormHelperText>Specify the level in the confidence intervals.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="penalizer-label"
                                        id="penalizer-selector"
                                        value= {this.state.selected_penalizer}
                                        label="penalizer"
                                        onChange={this.handleSelectPenalizerChange}
                                        type="number"
                                />
                                <FormHelperText>Attach a penalty to the size of the coefficients during regression.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="l1_ratio-label"
                                        id="l1_ratio-selector"
                                        value= {this.state.selected_l1_ratio}
                                        label="l1_ratio"
                                        onChange={this.handleSelectL1RatioChange}
                                        type="number"
                                />
                                <FormHelperText>Specify what ratio to assign to a L1 vs L2 penalty.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="n_baseline_knots-label"
                                        id="n_baseline_knots-selector"
                                        value= {this.state.selected_n_baseline_knots}
                                        label="n_baseline_knots"
                                        onChange={this.handleSelectNBaselineKnotsChange}
                                        type="number"
                                />
                                <FormHelperText>Used when baseline_estimation_method="spline". Set the number of knots
                                    (interior & exterior) in the baseline hazard, which will be placed evenly along the time axis.
                                    Should be at least 2.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="breakpoints-label"
                                        id="breakpoints-selector"
                                        value= {this.state.selected_breakpoints}
                                        label="breakpoints"
                                        onChange={this.handleSelectBreakpointsChange}
                                        type="number"
                                />
                                <FormHelperText>Used when baseline_estimation_method="piecewise". Set the positions of
                                    the baseline hazard breakpoints.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="event_col-selector-label">event_col</InputLabel>
                                <Select
                                        labelId="event_col-selector-label"
                                        id="event_col-selector"
                                        value= {this.state.selected_event_col}
                                        label="event_col"
                                        onChange={this.handleSelectEventColChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select the name of the column in DataFrame that contains the subjects’
                                    death observation. If left as None, assume all individuals are uncensored.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="weights_col-selector-label">weights_col</InputLabel>
                                <Select
                                        labelId="weights_col-selector-label"
                                        id="weights_col-selector"
                                        value= {this.state.selected_weights_col}
                                        label="weights_col"
                                        onChange={this.handleSelectWeightsColChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Column in the DataFrame, that denotes the weight per subject. This column
                                    is expelled and not used as a covariate, but as a weight in the final regression.
                                    Default weight is 1. This can be used for case-weights.
                                    For example, a weight of 2 means there were two subjects with identical observations.
                                    This can be used for sampling weights. In that case, use robust=True to get more accurate standard errors.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="cluster_col-selector-label">cluster_col</InputLabel>
                                <Select
                                        labelId="cluster_col-selector-label"
                                        id="cluster_col-selector"
                                        value= {this.state.selected_cluster_col}
                                        label="cluster_col"
                                        onChange={this.handleSelectClusterColChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Column in the DataFrame, that specifies what column has unique identifiers
                                    for clustering covariances. Using this forces the sandwich estimator (robust variance estimator) to be used.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="entry_col-selector-label">entry_col</InputLabel>
                                <Select
                                        labelId="entry_col-selector-label"
                                        id="entry_col-selector"
                                        value= {this.state.selected_entry_col}
                                        label="entry_col"
                                        onChange={this.handleSelectEntryColChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Column denoting when a subject entered the study, i.e. left-truncation.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="strata-selector-label">strata</InputLabel>
                                <Select
                                        labelId="strata-selector-label"
                                        id="strata-selector"
                                        value= {this.state.selected_strata}
                                        multiple
                                        label="Strata"
                                        onChange={this.handleSelectStrataVariableChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select a list of columns to use in stratification. This is useful if a
                                    categorical covariate does not obey the proportional hazard assumption. </FormHelperText>
                                <Button onClick={this.clearStrata}>
                                    Clear Selections
                                </Button>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="values-label"
                                        id="values-selector"
                                        value= {this.state.selected_values}
                                        label="values"
                                        onChange={this.handleSelectValuesChange}
                                        type="number"
                                />
                                <FormHelperText>An iterable of the specific values we wish the covariate(s) to take on.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="baseline_estimation_method-label">baseline_estimation_method</InputLabel>
                                <Select
                                        labelId="baseline_estimation_method-label"
                                        id="baseline_estimation_method-selector"
                                        value= {this.state.selected_baseline_estimation_method}
                                        label="baseline_estimation_method"
                                        onChange={this.handleSelectBaselineEstimationMethodChange}
                                >
                                    <MenuItem value={"breslow"}><em>breslow</em></MenuItem>
                                    <MenuItem value={"spline"}><em>spline</em></MenuItem>
                                    <MenuItem value={"piecewise"}><em>piecewise</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify how the fitter should estimate the baseline.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="hazard_ratios-label">Hazard ratios</InputLabel>
                                <Select
                                        labelId="hazard_ratios-label"
                                        id="hazard_ratios-selector"
                                        value= {this.state.selected_hazard_ratios}
                                        label="Hazard ratios"
                                        onChange={this.handleSelectHazardRatiosChange}
                                >
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                    <MenuItem value={"False"}><em>False</em></MenuItem>
                                </Select>
                                <FormHelperText>False, plot will present the log-hazard ratios (the coefficients).
                                    True, the hazard ratios are presented instead.</FormHelperText>
                            </FormControl>



                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        <ProceedButton></ProceedButton>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Cox Regression Results
                        </Typography>
                        <hr/>
                        <Grid container direction="row" style={{ display: (this.state.cox_show ? 'block' : 'none') }}>
                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >Concordance Index: { this.state.test_data.Concordance_Index}</Typography>
                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >Akaike information criterion (AIC) (partial log-likelihood): { this.state.test_data.AIC}</Typography>
                            <hr className="result" style={{display: (this.state.cox_show ? 'block' : 'none')}}/>
                            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                Dataframe of the coefficients, p-values, CIs, etc.
                            </Typography>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{alignContent:"right"}}>
                                            <TableCell className="tableHeadCell" >covariate</TableCell>
                                            <TableCell className="tableHeadCell" >Coef.</TableCell>
                                            <TableCell className="tableHeadCell" >exp(coef)</TableCell>
                                            <TableCell className="tableHeadCell" >se(coef)</TableCell>
                                            <TableCell className="tableHeadCell" >coef lower 95%</TableCell>
                                            <TableCell className="tableHeadCell" >coef upper 95%'</TableCell>
                                            <TableCell className="tableHeadCell" >exp(coef) lower 95%</TableCell>
                                            <TableCell className="tableHeadCell" >exp(coef) upper 95%</TableCell>
                                            <TableCell className="tableHeadCell" >cmp to</TableCell>
                                            <TableCell className="tableHeadCell" >z</TableCell>
                                            <TableCell className="tableHeadCell" >p</TableCell>
                                            <TableCell className="tableHeadCell" >-log2(p)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    { this.state.test_data.Dataframe.map((item) => {
                                        return (
                                                <TableRow>
                                                    <TableCell className="tableCell">{item.id}</TableCell>
                                                    <TableCell className="tableCell">{ Number.parseFloat(item.col0).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col1).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col2).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col3).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col4).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col5).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col6).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col7).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col8).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col9).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.col10).toFixed(6)}</TableCell>
                                                </TableRow>
                                        );
                                    })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <hr className="result" style={{display: (this.state.cox_show ? 'block' : 'none')}}/>
                            { this.state.test_data.figure.map((item) => {
                                let xfigure = item
                                if (xfigure.figure_1) {
                                return (
                                        <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                            <InnerHTML html={item.figure_1} style={{zoom:'50%'}}/>
                                            <hr className="result"/>
                                        </Grid>)}
                                if (xfigure.figure_2) {
                                    return (
                                            <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                <InnerHTML html={item.figure_2} style={{zoom:'50%'}}/>
                                                <hr className="result"/>
                                            </Grid>)}

                                })}
                            <hr className="result" style={{display: (this.state.cox_show ? 'block' : 'none')}}/>
                            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                Proportional hazard test.
                            </Typography>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{alignContent:"right"}}>
                                            <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'25%'}}>test_statistic</TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'25%'}}>p</TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'25%'}}>-log2(p)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    { this.state.test_data.proportional_hazard_test.map((item) => {
                                        return (
                                                <TableRow>
                                                    <TableCell className="tableCell">{item.id}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.test_statistic).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item.p).toFixed(6)}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(item['-log2(p)']).toFixed(6)}</TableCell>
                                                </TableRow>
                                        );
                                    })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}
export default SurvivalAnalysisCoxRegression;
