// import React from 'react';
import * as React from 'react';
import '../../pages/hypothesis_testing/normality_tests.scss'
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
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextareaAutosize,
    TextField,
    Typography
} from "@mui/material";

import qs from "qs";
import {Box} from "@mui/system";
import Paper from "@mui/material/Paper";
import InnerHTML from "dangerously-set-html-content";

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


class LDAFunctionPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],
            initialdataset:[],
            binary_columns: [],
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_solver: "svd",
            selected_shrinkage_1: "none",
            selected_shrinkage_1_show: false,
            selected_shrinkage_2: 0,
            selected_shrinkage_2_show: false,
            selected_independent_variables: [],
            test_data:{
                coefficients: "",
                intercept: "",
                dataframe: ""
            },
            // Hide/show results
            LDA_show : false,
            tabvalue : 0
        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectSolverChange = this.handleSelectSolverChange.bind(this);
        this.handleSelectShrinkage1Change = this.handleSelectShrinkage1Change.bind(this);
        this.handleSelectShrinkage2Change = this.handleSelectShrinkage2Change.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        // this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.debug = this.debug.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchColumnNames();
        // this.fetchBinaryColumnNames();
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
        this.setState({LDA_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("return_LDA", {
                    params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dependent_variable: this.state.selected_dependent_variable, solver: this.state.selected_solver,
                        shrinkage_1: this.state.selected_shrinkage_1,
                        shrinkage_2: this.state.selected_shrinkage_2,
                        independent_variables: this.state.selected_independent_variables},
                paramsSerializer : params => {
                    return qs.stringify(params, { arrayFormat: "repeat" })
                }
        }).then(res => {
            this.setState({test_data: res.data})
            this.setState({LDA_show: true})
            this.setState({tabvalue:0})
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
                        this.setState({columns: res.data.columns})
                        this.setState({initialdataset: res.data.dataFrame})
                        this.setState({tabvalue:1})
            console.log(res.data.dataFrame)
        });
    }

    // async fetchBinaryColumnNames(url, config) {
    //     const params = new URLSearchParams(window.location.search);
    //     API.get("return_binary_columns",
    //             {params: {
    //                     workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
    //                     step_id: params.get("step_id")
    //                 }}).then(res => {
    //         console.log(res.data.columns)
    //         this.setState({binary_columns: res.data.columns})
    //     });
    // }

    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
    }
    handleSelectSolverChange(event){
        this.setState( {selected_solver: event.target.value})
        if (event.target.value === 'svd')
        {this.state.selected_shrinkage_1_show = false}
        else
        {this.state.selected_shrinkage_1_show = true}
    }
    handleSelectShrinkage1Change(event){
        this.setState( {selected_shrinkage_1: event.target.value})
        if (event.target.value === 'float')
        {this.state.selected_shrinkage_2_show = true}
        else
        {
            this.state.selected_shrinkage_2_show = false
            this.state.selected_shrinkage_2 = 0
        }
    }
    handleSelectShrinkage2Change(event){
        if (event.target.value<0 || event.target.value<1)
        {
            this.setState( {selected_shrinkage_2: event.target.value})

        }else{alert("KKK")
            return}
    }
    // handleSelectShrinkage3Change(event){
    //     this.setState( {selected_shrinkage_3: event.target.value})
    // }
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
    }
    clear(){
        this.setState({selected_independent_variables: []})
    }
    selectAll(){
        this.setState({selected_independent_variables: this.state.columns})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            LDA Parameterisation
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
                                <InputLabel id="solver-label">Solver</InputLabel>
                                <Select
                                        labelId="solver-label"
                                        id="solver-selector"
                                        value= {this.state.selected_solver}
                                        label="Solver"
                                        onChange={this.handleSelectSolverChange}
                                >
                                    <MenuItem value={"svd"}><em>svd</em></MenuItem>
                                    <MenuItem value={"lsqr"}><em>lsqr</em></MenuItem>
                                    <MenuItem value={"eigen"}><em>eigen</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which solver to use.</FormHelperText>
                            </FormControl>
                            <div style={{ display: (this.state.selected_shrinkage_1_show ? 'block' : 'none') }}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="shrinkage-label">Shrinkage</InputLabel>
                                <Select
                                        labelId="shrinkage-label"
                                        id="shrinkage-selector"
                                        value= {this.state.selected_shrinkage_1}
                                        label="Shrinkage"
                                        onChange={this.handleSelectShrinkage1Change}
                                >
                                    <MenuItem value={"none"}><em>No shrinkage</em></MenuItem>
                                    <MenuItem value={"auto"}><em>Automatic shrinkage using the Ledoit-Wolf lemma</em></MenuItem>
                                    <MenuItem value={"float"}><em>Fixed shrinkage parameter</em></MenuItem>
                                </Select>
                                <FormHelperText>Shrinkage float</FormHelperText>
                            </FormControl>
                            </div>
                            <div style={{ display: (this.state.selected_shrinkage_2_show ? 'block' : 'none') }}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="shrinkage-2-label"
                                        id="shrinkage-2-selector"
                                        value= {this.state.selected_shrinkage_2}
                                        label="Shrinkage float"
                                        onChange={this.handleSelectShrinkage2Change}
                                        type="number"
                                />
                                <FormHelperText>Selection must be a float between 0 and 1</FormHelperText>
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
                            LDA Result
                        </Typography>
                        <hr/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Results" {...a11yProps(0)} />
                                    <Tab label="Initial Dataset" {...a11yProps(1)} />
                                    <Tab label="New Dataset" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <Grid container direction="row">
                                    <Grid sx={{ flexGrow: 1, textAlign: "center" }} >
                                        <div style={{ display: (this.state.LDA_show ? 'block' : 'none') }}>
                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, padding:'20px'}} >
                                                Coefficients and Intercept term
                                            </Typography>
                                            <div dangerouslySetInnerHTML={{__html: this.state.test_data.coefficients}} />
                                        </div>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <InnerHTML html={this.state.initialdataset} style={{fontSize:'11px', wordWrap: 'break-word'}}/>
                                {/*<TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}}>*/}
                                {/*    <Table>*/}
                                {/*        <TableHead>*/}
                                {/*            <TableRow sx={{alignContent:"right"}}>*/}
                                {/*                <TableCell className="tableHeadCell" sx={{width:'30%'}}></TableCell>*/}
                                {/*                {*/}
                                {/*                    this.state.columns.map((item)=>{*/}
                                {/*                        return (*/}
                                {/*                                <TableCell className="tableHeadCell">{item}</TableCell>*/}
                                {/*                        )})}*/}
                                {/*            </TableRow>*/}
                                {/*        </TableHead>*/}
                                {/*        <TableBody>*/}
                                {/*            <TableRow>*/}
                                {/*                {this.state.initialdataset.map((index, item)=> {*/}
                                {/*                    return (*/}
                                {/*                            <TableCell className="tableCell">{item}</TableCell>*/}
                                {/*                    );*/}
                                {/*                })}*/}
                                {/*            </TableRow>*/}
                                {/*        </TableBody>*/}
                                {/*    </Table>*/}
                                {/*</TableContainer>*/}
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                Item Three
                            </TabPanel>
                        </Box>

                    </Grid>
                </Grid>
        )
    }
}

export default LDAFunctionPage;
