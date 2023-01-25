import React from 'react';
import API from "../../axiosInstance";
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
    Select,
    Typography
} from "@mui/material";
import qs from "qs";
import {DataGrid} from "@mui/x-data-grid";

const userColumns = [
    { field: "Source",
        headerName: "Names of the factor considered", width: '35%',
        align: "left",
        headerAlign: "left",
        flex:3,
        sortable: true},
    {
        field: "SS",
        headerName: "Sums of squares",
        width: '5%',
        align: "center",
        headerAlign: "center",
        flex:0.5,
        type: "number"
    },
    {
        field: "DF",
        headerName: "Degrees of freedom",
        width: '10%',
        align: "right",
        headerAlign: "center",
        flex:0.5,
        type: "number"
    },
    {
        field: "F",
        headerName: "F-values",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "p-unc",
        headerName: "Uncorrected p-values",
        width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "np2",
        headerName: "Partial eta-squared",
        width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1,
        type: "number"
    }];

class Ancova extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: {
                DataFrame:[]
            },
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_between_factor: "",
            selected_covariate_variables: [],
            selected_effsize:"np2"
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectBetweenFactorChange = this.handleSelectBetweenFactorChange.bind(this);
        this.handleSelectCovariateVariableChange = this.handleSelectCovariateVariableChange.bind(this);
        this.handleSelectEffsizeChange = this.handleSelectEffsizeChange.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        this.fetchColumnNames();

    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({column_names: res.data.columns})
        });
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("ancova",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dv: this.state.selected_dependent_variable,
                        between: this.state.selected_between_factor,
                        covar: this.state.selected_covariate_variables,
                        effsize: this.state.selected_effsize
                    },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data})
        });
    }


    /**
     * Update state when selection changes in the form
     */
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
    }
    handleSelectBetweenFactorChange(event){
        this.setState( {selected_between_factor: event.target.value})
    }
    handleSelectCovariateVariableChange(event){
        this.setState( {selected_covariate_variables: event.target.value})
    }
    handleSelectEffsizeChange(event){
        this.setState( {selected_effsize: event.target.value})
    }

    clear(){
        this.setState({selected_covariate_variables: []})
    }
    selectAll(){
        this.setState({selected_covariate_variables: this.state.column_names})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Ancova Parameterisation
                        </Typography>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                            <FormHelperText>Selected Variables</FormHelperText>
                            <List style={{fontSize:'9px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                {this.state.selected_covariate_variables.map((column) => (
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
                                <InputLabel id="column-selector-label">Dependent Variable</InputLabel>
                                <Select
                                        labelId="dependent-selector-label"
                                        id="dependent-selector"
                                        value= {this.state.selected_dependent_variable}
                                        label="Dependent Variable"
                                        onChange={this.handleSelectDependentVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column in data with the dependent variable.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Between factor</InputLabel>
                                <Select
                                        labelId="Between-selector-label"
                                        id="Between-selector"
                                        value= {this.state.selected_between_factor}
                                        label="Between factor"
                                        onChange={this.handleSelectBetweenFactorChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column in data with the between factor.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Variable(s) with the covariate</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_covariate_variables}
                                        multiple
                                        label="Column"
                                        onChange={this.handleSelectCovariateVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select variables for correlation test</FormHelperText>
                                <Button onClick={this.selectAll}>
                                    Select All Variables
                                </Button>
                                <Button onClick={this.clear}>
                                    Clear Selections
                                </Button>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="effsize-selector-label">effsize</InputLabel>
                                <Select
                                        labelid="effsize-selector-label"
                                        id="effsize-selector"
                                        value= {this.state.selected_effsize}
                                        label="effsize parameter"
                                        onChange={this.handleSelectEffsizeChange}
                                >
                                    <MenuItem value={"np2"}><em>np2</em></MenuItem>
                                    <MenuItem value={"n2"}><em>n2</em></MenuItem>
                                </Select>
                                <FormHelperText>Effect size. Must be ‘np2’ (partial eta-squared) or ‘n2’ (eta-squared).</FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <div className="datatable">
                            {/*<p className="result_texts">Pearson’s correlation coefficient :  { this.state.test_data.DataFrame}</p>*/}
                            <DataGrid sx={{width:'90%', height:'700px', display: 'flex', marginLeft: 'auto', marginRight: 'auto'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.test_data.DataFrame}
                                      columns= {userColumns}
                                      pageSize= {15}
                                      rowsPerPageOptions={[15]}
                            />
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default Ancova;
