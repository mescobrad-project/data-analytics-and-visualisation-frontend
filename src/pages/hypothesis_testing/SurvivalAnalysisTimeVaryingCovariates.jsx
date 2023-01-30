import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import "./linearmixedeffectsmodel.scss"
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
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField, Typography
} from "@mui/material";

import qs from "qs";
import Paper from "@mui/material/Paper";
import InnerHTML from "dangerously-set-html-content";

class SurvivalAnalysisTimeVaryingCovariates extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],
            binary_columns: [],
            //Values selected currently on the form
            selected_event_col: "",
            selected_duration_col: "",
            selected_column_1: "",
            selected_column_2: "",
            selected_correction_columns: "False",
            selected_time_gaps: 1,
            selected_alpha: 0.05,
            selected_penalizer: 0,
            selected_l1_ratio: 0,
            selected_weights_col: "",
            selected_strata: [],
            // selected_entry_col: "",
            // start_col (string) – the column that contains the start of a subject’s time period.
            // stop_col (string) – the column that contains the end of a subject’s time period.
            // show_progress (since the fitter is iterative, show convergence) – diagnostics.
            // robust (bool, optional (default: True)) – Compute the robust errors using the Huber sandwich estimator, aka Wei-Lin estimate.
            // initial_point ((d,) numpy array, optional) – initialize the starting point of the iterative algorithm. Default is the zero vector.
            test_data:{
                AIC: [],
                Dataframe: [],
                figure:[],
            },
            // Hide/show results
            TVC_show : false,
        };
        //Binding functions of the class
        this.handleSelectColumn_1Change = this.handleSelectColumn_1Change.bind(this);
        this.handleSelectColumn_2Change = this.handleSelectColumn_2Change.bind(this);
        this.handleSelectStrataVariableChange = this.handleSelectStrataVariableChange.bind(this);
        this.handleSelectTimeGapsChange = this.handleSelectTimeGapsChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectCorrectionColumnsChange = this.handleSelectCorrectionColumnsChange.bind(this);
        this.handleSelectPenalizerChange= this.handleSelectPenalizerChange.bind(this);
        this.handleSelectL1RatioChange= this.handleSelectL1RatioChange.bind(this);
        this.handleSelectDurationColChange= this.handleSelectDurationColChange.bind(this);
        this.handleSelectEventColChange= this.handleSelectEventColChange.bind(this);
        this.handleSelectWeightsColChange= this.handleSelectWeightsColChange.bind(this);
        // this.handleSelectEntryColChange= this.handleSelectEntryColChange.bind(this);

        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.clear = this.clear.bind(this);
        this.clearStrata = this.clearStrata.bind(this);
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
        this.setState({TVC_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("time_varying_covariates", {
            params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                event_col: this.state.selected_event_col,
                duration_col: this.state.selected_duration_col,
                column_1: this.state.selected_column_1,
                column_2: this.state.selected_column_2,
                correction_columns: this.state.selected_correction_columns,
                time_gaps: this.state.selected_time_gaps,
                alpha: this.state.selected_alpha,
                penalizer: this.state.selected_penalizer,
                l1_ratio: this.state.selected_l1_ratio,
                // weights_col: this.state.selected_weights_col,
                // entry_col: this.state.selected_entry_col,
                // strata: this.state.selected_strata,
            },
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            this.setState({test_data: res.data})
            this.state.TVC_show=true
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
    handleSelectCorrectionColumnsChange(event){
        this.setState( {selected_correction_columns: event.target.value})
    }
    handleSelectColumn_1Change(event){
        this.setState( {selected_column_1: event.target.value})
    }
    handleSelectColumn_2Change(event){
        this.setState( {selected_column_2: event.target.value})
    }
    handleSelectTimeGapsChange(event){
        this.setState( {selected_time_gaps: event.target.value})
    }
    handleSelectPenalizerChange(event){
        this.setState( {selected_penalizer: event.target.value})
    }
    handleSelectL1RatioChange(event){
        this.setState( {selected_l1_ratio: event.target.value})
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
    // handleSelectEntryColChange(event){
    //     this.setState( {selected_entry_col: event.target.value})
    // }
    handleSelectStrataVariableChange(event){
        this.setState( {selected_strata: event.target.value})
    }
    clear(){
        this.setState({selected_Column_1: []})
    }
    clearStrata(){
        this.setState({selected_strata: []})
    }
    selectAll(){
        this.setState({selected_Column_1: this.state.columns})
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
                                <InputLabel id="Column_1-label">Column 1</InputLabel>
                                <Select
                                        labelId="Column_1-label"
                                        id="Column_1-selector"
                                        value= {this.state.selected_Column_1}
                                        label="Column 1"
                                        onChange={this.handleSelectColumn_1Change}
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
                                <InputLabel id="Column_2-label">Column 2</InputLabel>
                                <Select
                                        labelId="Column_2-label"
                                        id="Column_2-selector"
                                        value= {this.state.selected_Column_2}
                                        label="Column 2"
                                        onChange={this.handleSelectColumn_2Change}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select the covariate(s) in the original dataset that we wish to vary.</FormHelperText>
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
                                        labelId="time_gaps-label"
                                        id="time_gaps-selector"
                                        value= {this.state.selected_time_gaps}
                                        label="time_gaps"
                                        onChange={this.handleSelectTimeGapsChange}
                                        type="number"
                                />
                                <FormHelperText>Specify a desired time_gap.</FormHelperText>
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
                            {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                            {/*    <InputLabel id="entry_col-selector-label">entry_col</InputLabel>*/}
                            {/*    <Select*/}
                            {/*            labelId="entry_col-selector-label"*/}
                            {/*            id="entry_col-selector"*/}
                            {/*            value= {this.state.selected_entry_col}*/}
                            {/*            label="entry_col"*/}
                            {/*            onChange={this.handleSelectEntryColChange}*/}
                            {/*    >*/}
                            {/*        {this.state.columns.map((column) => (*/}
                            {/*                <MenuItem value={column}>*/}
                            {/*                    {column}*/}
                            {/*                </MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </Select>*/}
                            {/*    <FormHelperText>Column denoting when a subject entered the study, i.e. left-truncation.</FormHelperText>*/}
                            {/*</FormControl>*/}
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
                                <InputLabel id="correction_columns-label">Correction columns</InputLabel>
                                <Select
                                        labelId="correction_columns-label"
                                        id="correction_columns-selector"
                                        value= {this.state.selected_correction_columns}
                                        label="Correction columns"
                                        onChange={this.handleSelectCorrectionColumnsChange}
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
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Cox Proportional Hazard model to a time varying dataset
                        </Typography>
                        <hr/>
                        <Grid container direction="row" style={{ display: (this.state.TVC_show ? 'block' : 'none') }}>
                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >Akaike information criterion (AIC) (partial log-likelihood): { this.state.test_data.AIC}</Typography>
                            <hr className="result" style={{display: (this.state.TVC_show ? 'block' : 'none')}}/>
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
                            <hr className="result" style={{display: (this.state.TVC_show ? 'block' : 'none')}}/>
                            { this.state.test_data.figure.map((item) => {
                                let xfigure = item
                                if (xfigure.figure_1) {
                                return (
                                        <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                            <InnerHTML html={item.figure_1} style={{zoom:'50%'}}/>
                                            <hr className="result"/>
                                        </Grid>)}
                                // if (xfigure.figure_2) {
                                //     return (
                                //             <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                //                 <InnerHTML html={item.figure_2} style={{zoom:'50%'}}/>
                                //                 <hr className="result"/>
                                //             </Grid>)}

                                })}
                            {/*<hr className="result" style={{display: (this.state.TVC_show ? 'block' : 'none')}}/>*/}
                            {/*<Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                            {/*    Proportional hazard test.*/}
                            {/*</Typography>*/}
                            {/*<TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}}>*/}
                            {/*    <Table>*/}
                            {/*        <TableHead>*/}
                            {/*            <TableRow sx={{alignContent:"right"}}>*/}
                            {/*                <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>*/}
                            {/*                <TableCell className="tableHeadCell" sx={{width:'25%'}}>test_statistic</TableCell>*/}
                            {/*                <TableCell className="tableHeadCell" sx={{width:'25%'}}>p</TableCell>*/}
                            {/*                <TableCell className="tableHeadCell" sx={{width:'25%'}}>-log2(p)</TableCell>*/}
                            {/*            </TableRow>*/}
                            {/*        </TableHead>*/}
                            {/*        <TableBody>*/}
                            {/*        { this.state.test_data.proportional_hazard_test.map((item) => {*/}
                            {/*            return (*/}
                            {/*                    <TableRow>*/}
                            {/*                        <TableCell className="tableCell">{item.id}</TableCell>*/}
                            {/*                        <TableCell className="tableCell">{Number.parseFloat(item.test_statistic).toFixed(6)}}</TableCell>*/}
                            {/*                        <TableCell className="tableCell">{Number.parseFloat(item.p).toFixed(6)}}</TableCell>*/}
                            {/*                        <TableCell className="tableCell">{Number.parseFloat(item['-log2(p)']).toFixed(6)}}</TableCell>*/}
                            {/*                    </TableRow>*/}
                            {/*            );*/}
                            {/*        })}*/}
                            {/*        </TableBody>*/}
                            {/*    </Table>*/}
                            {/*</TableContainer>*/}
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}
export default SurvivalAnalysisTimeVaryingCovariates;
