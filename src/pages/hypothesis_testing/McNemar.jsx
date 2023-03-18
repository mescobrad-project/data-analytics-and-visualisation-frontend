import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid, InputLabel, MenuItem, Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs,
    Typography
} from "@mui/material";
import Paper from "@mui/material/Paper";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import PropTypes from "prop-types";

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

class McNemar extends React.Component {
    constructor(props){
        super(props);
        // const params = new URLSearchParams(window.location.search);
        this.state = {
            test_data: {
                statistic: "",
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
            selected_exact: true,
            selected_correction:false,
            correction_show:false,
            stats_show: false
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.handleSelectColumnVariableChange = this.handleSelectColumnVariableChange.bind(this);
        this.handleSelectRowVariableChange = this.handleSelectRowVariableChange.bind(this);
        this.handleSelectExactChange = this.handleSelectExactChange.bind(this);
        this.handleSelectCorrectionChange = this.handleSelectCorrectionChange.bind(this);
        this.fetchBinaryColumnNames();
        this.fetchColumnNames();
    }

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({columns: res.data.columns})
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
            this.setState({tabvalue:1})
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

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})
        // Send the request
        API.get("mc_nemar",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        variable_column: this.state.selected_column_variable,
                        variable_row: this.state.selected_row_variable,
                        exact: this.state.selected_exact,
                        correction: this.state.selected_correction
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
            this.setState({tabvalue:0})
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
    handleSelectExactChange(event){
        this.setState( {selected_exact: event.target.value})
        console.log(event.target.value)
        if (event.target.value === 'true'){
            this.setState({correction_show: false})
            console.log('Hide')
        }
        else
        {
            this.setState({correction_show: true})
            console.log('Show')
        }
    }
    handleSelectCorrectionChange(event){
        this.setState( {selected_correction: event.target.value})
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
                                <InputLabel id="exact-selector-label">exact</InputLabel>
                                <Select
                                        labelid="exact-selector-label"
                                        id="exact-selector"
                                        value= {this.state.selected_exact}
                                        label="exact parameter"
                                        onChange={this.handleSelectExactChange}
                                >
                                    <MenuItem value={"false"}><em>false</em></MenuItem>
                                    <MenuItem value={"true"}><em>true</em></MenuItem>
                                </Select>
                                <FormHelperText>If exact is true, then the binomial distribution will be used. If exact is false, then the chisquare distribution will be used, which is the approximation to the distribution of the test statistic for large sample sizes.. </FormHelperText>
                            </FormControl>
                            <div style={{ display: (this.state.correction_show ? 'block' : 'none')}}>
                            <FormControl  sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="correction-selector-label">Correction</InputLabel>
                                <Select
                                        labelid="correction-selector-label"
                                        id="correction-selector"
                                        value= {this.state.selected_correction}
                                        label="Correction"
                                        onChange={this.handleSelectCorrectionChange}
                                >
                                    <MenuItem value={"false"}><em>false</em></MenuItem>
                                    <MenuItem value={"true"}><em>true</em></MenuItem>
                                </Select>
                                <FormHelperText>If true, then a continuity correction is used for the chisquare distribution.</FormHelperText>
                            </FormControl>
                            </div>
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
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Results" {...a11yProps(0)} />
                                    <Tab label="Initial Dataset" {...a11yProps(1)} />
                                    {/*<Tab label="New Dataset" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                        { this.state.selected_row_variable} * {this.state.selected_column_variable} Crosstabulation</Typography>
                                    <TableContainer component={Paper} className="ExtremeValues" sx={{width:'50%', minWidth:'120px'}}>
                                        <Table sx={{textAlign:"right"}}>
                                            <TableHead>
                                                <TableRow >
                                                    <TableCell sx={{border:'none'}}></TableCell>
                                                    <TableCell align="center" colSpan={3} style={{fontWeight:'bold', borderTop:'none'}}>{this.state.selected_column_variable}</TableCell></TableRow>
                                                <TableRow>
                                                    <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}} >{this.state.selected_row_variable}</TableCell>
                                                    {this.state.crosstab_cols.map((column) => (
                                                            <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}} value={column}>{column}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}} >{this.state.crosstab_index[0]}</TableCell>
                                                    {this.state.crosstab_data_0.map((column) => (
                                                            <TableCell align="center" style={{borderTop:'none'}} value={column}>{column}</TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}} >{this.state.crosstab_index[1]}</TableCell>
                                                    {this.state.crosstab_data_1.map((column) => (
                                                            <TableCell align="center" style={{borderTop:'none'}} value={column}>{column}</TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}} >{this.state.crosstab_index[2]}</TableCell>
                                                    {this.state.crosstab_data_2.map((column) => (
                                                            <TableCell align="center" style={{borderTop:'none'}} value={column}>{column}</TableCell>
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
                                                    <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}}>statistic</TableCell>
                                                    <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}}>p_value</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center" style={{fontWeight:'bold' , borderTop:'none'}}>McNemar's test of homogeneity</TableCell>
                                                    <TableCell align="center">{ Number.parseFloat(this.state.test_data.statistic).toExponential(4)}</TableCell>
                                                    <TableCell align="center">{Number.parseFloat(this.state.test_data.p_value).toExponential(4)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                            </TabPanel>
                            {/*<TabPanel value={this.state.tabvalue} index={2}>*/}
                            {/*    Item Three*/}
                            {/*</TabPanel>*/}
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default McNemar;
