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
    MenuItem,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField, Typography
} from "@mui/material";

import qs from "qs";
import Paper from "@mui/material/Paper";

class PrincipalComponentAnalysis extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],
            //Values selected currently on the form
            selected_n_components_1: 2,
            selected_n_components_2: 0,
            selected_independent_variables: [],
            test_data:{
                columns:[],
                n_features_:"",
                n_features_in_:"",
                n_samples_:"",
                random_state:"",
                iterated_power:"",
                mean_:[],
                explained_variance_:[],
                noise_variance_:"",
                pve: [],
                singular_values: [],
                principal_axes: []
            },
            // Hide/show results
            PCA_show : false
        };

        //Binding functions of the class
        this.handleSelectNComponents1Change = this.handleSelectNComponents1Change.bind(this);
        this.handleSelectNComponents2Change = this.handleSelectNComponents2Change.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.debug = this.debug.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchColumnNames();
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
        this.setState({PCA_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("principal_component_analysis", {
                    params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        n_components_1: this.state.selected_n_components_1,
                        n_components_2: this.state.selected_n_components_2,
                        independent_variables: this.state.selected_independent_variables},
                paramsSerializer : params => {
                    return qs.stringify(params, { arrayFormat: "repeat" })
                }
        }).then(res => {
            this.setState({test_data: res.data})
            this.setState({PCA_show: true})
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
                        console.log(res.data.columns)
            this.setState({columns: res.data.columns})
        });
    }

    handleSelectNComponents1Change(event){
        this.setState( {selected_n_components_1: event.target.value})
    }
    handleSelectNComponents2Change(event){
        this.setState( {selected_n_components_2: event.target.value})
    }
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
    }
    clear(){
        this.setState({selected_independent_variables: []})
    }
    selectAll(){
        this.setState({selected_independent_variables: this.state.columns})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Principal component analysis Parameterisation
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
                            <div>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <TextField
                                            labelId="n_components_1-label"
                                            id="n_components_1-selector"
                                            value= {this.state.selected_n_components_1}
                                            label="No components"
                                            onChange={this.handleSelectNComponents1Change}
                                            type="number"
                                    />
                                    <FormHelperText>Selection must be an integer</FormHelperText>
                                </FormControl>
                            </div>
                            <div>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <TextField
                                            labelId="n_components_2-label"
                                            id="n_components_2-selector"
                                            value= {this.state.selected_n_components_2}
                                            label="No components"
                                            onChange={this.handleSelectNComponents2Change}
                                            type="number"
                                    />
                                    <FormHelperText>Selection must be a float (0,1)</FormHelperText>
                                </FormControl>
                            </div>
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
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Principal component analysis Result
                        </Typography>
                        <hr/>
                        <Grid container direction="row">
                            <Grid sx={{ flexGrow: 1}} >
                                <div style={{ display: (this.state.PCA_show ? 'block' : 'none') }}>
                                    <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}}>
                                        <Table sx={{textAlign:"right"}}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="tableHeadCell" sx={{width:'60%'}}></TableCell>
                                                    <TableCell className="tableHeadCell" sx={{width:'40%'}}>test_statistic</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="tableCell">{'Number of features in the training data.'}</TableCell>
                                                    <TableCell className="tableCell">{this.state.test_data.n_features_}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="tableCell">{'Number of features seen during fit.'}</TableCell>
                                                    <TableCell className="tableCell">{this.state.test_data.n_features_in_}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="tableCell">{'Number of samples in the training data.'}</TableCell>
                                                    <TableCell className="tableCell">{this.state.test_data.n_samples_}</TableCell>
                                                </TableRow>
                                                {/*<TableRow>*/}
                                                {/*    <TableCell className="tableCell">{'Used when the ‘arpack’ or ‘randomized’ solvers are used.'}</TableCell>*/}
                                                {/*    <TableCell className="tableCell">{this.state.test_data.random_state}</TableCell>*/}
                                                {/*</TableRow>*/}
                                                <TableRow>
                                                    <TableCell className="tableCell">{'Number of iterations for the power method.'}</TableCell>
                                                    <TableCell className="tableCell">{this.state.test_data.iterated_power}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="tableCell">{'The estimated noise covariance following the Probabilistic PCA model from Tipping and Bishop 1999.'}</TableCell>
                                                    <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.noise_variance_).toFixed(6)}</TableCell>
                                                </TableRow>
                                                {this.state.test_data.explained_variance_.map((item)=> {
                                                    return (
                                                            <TableRow>
                                                                <TableCell className="tableCell">{'The amount of variance explained by each of the selected components. The variance estimation uses n_samples - 1 degrees of freedom.'}</TableCell>
                                                                <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>
                                                            </TableRow>);
                                                })}
                                                {this.state.test_data.pve.map((item)=> {
                                                    return (
                                                            <TableRow>
                                                                <TableCell className="tableCell">{'Percentage of variance explained by each of the selected components.'}</TableCell>
                                                                <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>
                                                            </TableRow>);
                                                })}
                                                {this.state.test_data.singular_values.map((item)=> {
                                                    return (
                                                            <TableRow>
                                                                <TableCell className="tableCell">{'The singular values corresponding to each of the selected components.'}</TableCell>
                                                                <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>
                                                            </TableRow>);
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{alignContent:"right"}}>
                                                    <TableCell className="tableHeadCell" sx={{width:'30%'}}></TableCell>
                                                {
                                                this.state.test_data.columns.map((item)=>{
                                                    return (
                                                                <TableCell className="tableHeadCell">{item}</TableCell>
                                                            )})}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="tableCell">{'Mean'}</TableCell>
                                                    {this.state.test_data.mean_.map((item)=> {
                                                        return (
                                                                <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="tableCell">{'Principal axes in feature space, representing the directions of maximum variance in the data.'}</TableCell>
                                                    {this.state.test_data.principal_axes.map((item)=> {
                                                        return (
                                                                <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}

export default PrincipalComponentAnalysis;
