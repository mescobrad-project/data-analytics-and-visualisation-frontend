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
    Card,
    Box,
    CardContent,
    ListItemText,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import qs from "qs";

const userColumns = [
    { field: "Cor",
        headerName: "Variables",
        // width: '15%',
        align: "left",
        headerAlign: "left",
        flex:2,
        sortable: true,
    },
    {
        field: "n",
        headerName: "n",
        width: '5%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "r",
        headerName: "r",
        width: '15%',
        align: "right",
        headerAlign: "center",
        flex:2
    },
    {
        field: "CI95%",
        headerName: "CI95%",
        width: '15%',
        align: "center",
        headerAlign: "center",
        flex:2
    },
    {
        field: "p-val",
        headerName: "p-val",
        width: '15%',
        align: "right",
        headerAlign: "center",
        flex:2
    },
    {
        field: "power",
        headerName: "power",
        width: '20%',
        align: "right",
        headerAlign: "center",
        flex:2
    }];
class Spearman_correlation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: {
                DataFrame:[]
            },
            //Values selected currently on the form
            selected_method: "spearman",
            selected_alternative: "two-sided",
            selected_independent_variables: []

        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.handleSelectAlternativeChange = this.handleSelectAlternativeChange.bind(this);
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
        API.get("correlations_pingouin",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        column_2: this.state.selected_independent_variables,
                        alternative: this.state.selected_alternative,
                        method: this.state.selected_method
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
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
    }
    handleSelectAlternativeChange(event){
        this.setState( {selected_alternative: event.target.value})
    }
    clear(){
        this.setState({selected_independent_variables: []})
    }
    selectAll(){
        this.setState({selected_independent_variables: this.state.column_names})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Spearman Correlation Parameterisation
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
                                <InputLabel id="column-selector-label">Variables</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables}
                                        multiple
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariableChange}
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
                                <InputLabel id="alternative-selector-label">Alternative</InputLabel>
                                <Select
                                        labelid="alternative-selector-label"
                                        id="alternative-selector"
                                        value= {this.state.selected_alternative}
                                        label="Alternative parameter"
                                        onChange={this.handleSelectAlternativeChange}
                                >
                                    <MenuItem value={"two-sided"}><em>two-sided</em></MenuItem>
                                    <MenuItem value={"less"}><em>less</em></MenuItem>
                                    <MenuItem value={"greater"}><em>greater</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines the alternative hypothesis. </FormHelperText>
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
                        <div>
                            <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        alignContent: 'center',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        p: 1,
                                        m: 1,
                                        bgcolor: 'background.paper',
                                        Width: '95%',
                                        borderRadius: 1,
                                    }}
                            >
                                {this.state.test_data.DataFrame.map((item)=>{
                                    return (
                                            <Card sx={{ minWidth: 100, borderRadius: 2, maxWidth:'33%', m:2}} variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h5" color="text.secondary" gutterBottom>
                                                        {item.Cor.split("-")[0]}
                                                        <br/>---Vs---
                                                        <br/>{item.Cor.split("-")[1]}
                                                        <br/>
                                                        <hr/>
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        n = {item.n}<br/>
                                                        r = {item.r}<br/>
                                                        CI95% = {item['CI95%']}<br/>
                                                        p-val = {item['p-val']}<br/>
                                                        power = {item.power}<br/>
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                    )})}
                            </Box>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default Spearman_correlation;
