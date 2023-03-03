import React from 'react';
import API from "../../axiosInstance";
import "./linearmixedeffectsmodel.scss"
import {
    Button,
    FormControl,
    FormHelperText,
    Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField,
    Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import Paper from "@mui/material/Paper";

class FisherExact extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            test_data: {
                odd_ratio: "",
                p_value: "",
                crosstab: ""
            },
            binary_columns: [],
            crosstab_cols:[],
            crosstab_index:[],
            crosstab_data:[],
            crosstab_data_0:[],
            crosstab_data_1:[],
            crosstab_data_2:[],
            result_crosstab:"",
            selected_column_variable: "",
            selected_row_variable: "",
            selected_alternative: "two-sided",
            stats_show: false
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.handleSelectColumnVariableChange = this.handleSelectColumnVariableChange.bind(this);
        this.handleSelectRowVariableChange = this.handleSelectRowVariableChange.bind(this);
        this.handleSelectAlternativeChange = this.handleSelectAlternativeChange.bind(this);
        this.fetchBinaryColumnNames();
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

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

        // Send the request
        API.get("fisher",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        variable_column: this.state.selected_column_variable,
                        variable_row: this.state.selected_row_variable,
                        alternative: this.state.selected_alternative
                        }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            const resultJson = JSON.parse(res.data.crosstab);
            this.setState({crosstab_cols:resultJson['columns']})
            this.setState({crosstab_index:resultJson['index']})
            this.setState({crosstab_data:resultJson['data']})
            this.setState({crosstab_data_0:resultJson['data'][0]})
            this.setState({crosstab_data_1:resultJson['data'][1]})
            this.setState({crosstab_data_2:resultJson['data'][2]})
            this.setState({stats_show: true})
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectRowVariableChange(event){
        if (event.target.value !== this.state.selected_column_variable)
        {
            this.setState( {selected_row_variable: event.target.value})
        }else{
            alert("You must select a different variable.")
            return
        }
    }
    handleSelectColumnVariableChange(event){
        if (event.target.value !== this.state.selected_row_variable)
        {
            this.setState( {selected_column_variable: event.target.value})
        }else{
            alert("You must select a different variable.")
            return
        }
    }
    handleSelectAlternativeChange(event){
        this.setState( {selected_alternative: event.target.value})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center", minWidth: 120}} noWrap>
                            Insert Parameters
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Variable</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_row_variable}
                                        label="Column"
                                        onChange={this.handleSelectRowVariableChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Row Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Variable</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_column_variable}
                                        label="Column"
                                        onChange={this.handleSelectColumnVariableChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Column variable</FormHelperText>
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
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr className="result"/>
                        <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                { this.state.selected_row_variable} * {this.state.selected_column_variable} Crosstabulation</Typography>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width:'50%', minWidth:'120px'}}>
                                <Table sx={{textAlign:"right"}}>
                                    <TableHead>
                                        <TableRow >
                                            <TableCell sx={{border:'none'}}></TableCell>
                                            <TableCell colSpan={3} className="tableHeadCell" style={{fontWeight:'bold', borderTop:'none'}}>{this.state.selected_column_variable}</TableCell></TableRow>
                                        <TableRow>
                                            <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}} className="tableHeadCell">{this.state.selected_row_variable}</TableCell>
                                            {this.state.crosstab_cols.map((column) => (
                                                    <TableCell className="tableHeadCell" value={column}>{column}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{fontWeight:'bold', width:'20%'}} className="tableCell" >{this.state.crosstab_index[0]}</TableCell>
                                            {this.state.crosstab_data_0.map((column) => (
                                                    <TableCell className="tableCell" value={column}>{column}</TableCell>
                                            ))}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight:'bold'}} className="tableCell" >{this.state.crosstab_index[1]}</TableCell>
                                            {this.state.crosstab_data_1.map((column) => (
                                                    <TableCell className="tableCell" value={column}>{column}</TableCell>
                                            ))}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight:'bold'}} className="tableCell" >{this.state.crosstab_index[2]}</TableCell>
                                            {this.state.crosstab_data_2.map((column) => (
                                                    <TableCell className="tableCell" value={column}>{column}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <br/>
                            <br/>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width:'70%', minWidth:'120px'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell/>
                                            <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}}>odd_ratio</TableCell>
                                            <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}}>p_value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}}>Fisher's Exact test</TableCell>
                                            <TableCell align="center">{ Number.parseFloat(this.state.test_data.odd_ratio).toExponential(4)}</TableCell>
                                            <TableCell align="center">{Number.parseFloat(this.state.test_data.p_value).toExponential(4)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default FisherExact;
