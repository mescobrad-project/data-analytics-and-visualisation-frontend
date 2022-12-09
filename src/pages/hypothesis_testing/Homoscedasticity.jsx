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
    Select, TextareaAutosize, TextField,
    Typography
} from "@mui/material";
import qs from "qs";

class Homoscedasticity extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: [],
            //Values selected currently on the form
            selected_column: "",
            selected_method: "Bartlett",
            selected_center: "median",
            selected_independent_variables: [],
            center_show:false
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectCenterChange = this.handleSelectCenterChange.bind(this);

        this.onClickButton = this.onClickButton.bind(this)
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);

        // // Initialise component
        // // - values of channels from the backend
        this.fetchColumnNames();

    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
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
        API.get("check_homoscedasticity",
                {
                    params: {
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        columns: this.state.selected_independent_variables,
                        name_of_test: this.state.selected_method,
                        center: this.state.selected_center},
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                }}
        ).then(res => {
            this.setState({test_data: res.data})
        });
    }


    /**
     * Update state when selection changes in the form
     */
    onClickButton(event) {
        const cnt = this.state.selected_independent_variables.map((item) => ({item}.length))
        if (cnt<2)
        {
            alert('At least TWO variables must be selected!')
            event.preventDefault();
        }
    }

    handleSelectColumnChange(event){
        this.setState( {selected_column: event.target.value})
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
        if (event.target.value=="Bartlett"){
            this.setState({center_show:false})
        }
        else {
            this.setState({center_show:true});
        }
    }
    handleSelectCenterChange(event){
        this.setState( {selected_center: event.target.value})
    }

    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
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
                            Select method for Homoscedasticity check
                        </Typography>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                            <FormHelperText>Selected Variables</FormHelperText>
                            <List style={{fontSize:'9px', backgroundColor:"lightgreen"}}>
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
                                <InputLabel id="column-selector-label">Column</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables}
                                        multiple
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariableChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Variables</FormHelperText>
                                <Button size={"small"} onClick={this.selectAll}>
                                    Select All Variables
                                </Button>
                                <Button size={"small"} onClick={this.clear}>
                                    Clear Selections
                                </Button>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="method-selector-label">Method</InputLabel>
                                <Select
                                        labelId="method-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="Method"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"Bartlett"}><em>Bartlett</em></MenuItem>
                                    <MenuItem value={"Fligner-Killeen"}><em>Fligner-Killeen</em></MenuItem>
                                    <MenuItem value={"Levene"}><em>Levene</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
                            </FormControl>
                            <FormControl style={{ display: (this.state.center_show ? 'block' : 'none') }}>
                                <InputLabel id="center-selector-label">Function</InputLabel>
                                <Select sx={{m: 1, width:'90%'}} size={"small"}
                                        labelid="center-selector-label"
                                        id="center-selector"
                                        value= {this.state.selected_center}
                                        label="Center parameter"
                                        onChange={this.handleSelectCenterChange}
                                >
                                    <MenuItem value={"trimmed"}><em>trimmed</em></MenuItem>
                                    <MenuItem value={"median"}><em>median</em></MenuItem>
                                    <MenuItem value={"mean"}><em>mean</em></MenuItem>
                                </Select>
                                <FormHelperText>Keyword argument controlling which function of the data is used in computing the test statistic. The default is ‘median’.</FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit" onClick={this.onClickButton}>
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
                            <p className="result_texts">Statistic :  { this.state.test_data['statistic']}</p>
                            <p className="result_texts">p value :    { this.state.test_data['p-value']}</p>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default Homoscedasticity;
