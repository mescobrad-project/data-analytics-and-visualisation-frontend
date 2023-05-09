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
    Select, Table, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField, Typography
} from "@mui/material";

import qs from "qs";
import Paper from "@mui/material/Paper";

class LinearMixedEffectsModel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],
            binary_columns: [],
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_groups: "",
            selected_use_sqrt: "True",
            selected_independent_variables: [],
            test_data:{
                first_table: [],
                second_table: []
            },
            // Hide/show results
            LMEM_show : false,
        };
        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectGroupsChange = this.handleSelectGroupsChange.bind(this);
        this.handleSelectUseSqrtChange = this.handleSelectUseSqrtChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
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
        this.setState({LMEM_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("linear_mixed_effects_model", {
            params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dependent: this.state.selected_dependent_variable,
                groups: this.state.selected_groups,
                use_sqrt: this.state.selected_use_sqrt,
                independent: this.state.selected_independent_variables},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            this.setState({test_data: res.data})
            this.state.LMEM_show=true
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

    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
    }
    handleSelectGroupsChange(event){
        this.setState( {selected_groups: event.target.value})
    }
    handleSelectUseSqrtChange(event){
        this.setState( {selected_use_sqrt: event.target.value})
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
                            Linear Mixed Effects Model Parameterisation
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
                                <FormHelperText>Select Dependent Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="groups-label">Groups</InputLabel>
                                <Select
                                        labelId="groups-label"
                                        id="groups-selector"
                                        value= {this.state.selected_groups}
                                        label="groups"
                                        onChange={this.handleSelectGroupsChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Specify group.</FormHelperText>
                            </FormControl>
                            <div>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="shrinkage-label">Use sqrt</InputLabel>
                                    <Select
                                            labelId="shrinkage-label"
                                            id="shrinkage-selector"
                                            value= {this.state.selected_use_sqrt}
                                            label="Shrinkage"
                                            onChange={this.handleSelectUseSqrtChange}
                                    >
                                        <MenuItem value={"True"}><em>True</em></MenuItem>
                                        <MenuItem value={"False"}><em>False</em></MenuItem>
                                    </Select>
                                    <FormHelperText>If True, optimization is carried out using the lower triangle of the
                                        square root of the random effects covariance matrix, otherwise it is carried out
                                        using the lower triangle of the random effects covariance matrix.</FormHelperText>
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
                            Mixed Linear Model Regression Results
                        </Typography>
                        <hr/>
                        <Grid container direction="row" style={{ display: (this.state.LMEM_show ? 'block' : 'none') }}>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{alignContent:"right"}}>
                                            <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    { this.state.test_data.first_table.map((item) => {
                                            return (
                                                    <TableRow>
                                                        <TableCell className="tableCell">{item.col0}</TableCell>
                                                        <TableCell className="tableCell">{item.col1}</TableCell>
                                                        <TableCell className="tableCell">{item.col2}</TableCell>
                                                        <TableCell className="tableCell">{item.col3}</TableCell>
                                                    </TableRow>
                                            );
                                    })}
                                </Table>
                            </TableContainer>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="tableHeadCell" sx={{width:'15%'}}></TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'15%'}}>Coef.</TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'15%'}}>Std.Err.</TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'15%'}}>z</TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'15%'}}>P>|z|</TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'15%'}}>[0.025</TableCell>
                                            <TableCell className="tableHeadCell" sx={{width:'15%'}}>0.975]</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    { this.state.test_data.second_table.map((item) => {
                                        return (
                                                <TableRow>
                                                    <TableCell className="tableCell">{item.id}</TableCell>
                                                    <TableCell className="tableCell">{item.col0}</TableCell>
                                                    <TableCell className="tableCell">{item.col1}</TableCell>
                                                    <TableCell className="tableCell">{item.col2}</TableCell>
                                                    <TableCell className="tableCell">{item.col3}</TableCell>
                                                    <TableCell className="tableCell">{item.col4}</TableCell>
                                                    <TableCell className="tableCell">{item.col5}</TableCell>
                                                </TableRow>
                                        );
                                    })}
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}
export default LinearMixedEffectsModel;
