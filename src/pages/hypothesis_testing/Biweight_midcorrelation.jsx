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
    Typography, Tabs, Tab
} from "@mui/material";
import qs from "qs";
import {DataGrid, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import JsonTable from "ts-react-json-table";

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
        flex:0.5
    },
    {
        field: "r",
        headerName: "r",
        width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1
    },
    {
        field: "CI95%",
        headerName: "CI95%",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "p-val",
        headerName: "p-val",
        width: '20%',
        align: "right",
        headerAlign: "center",
        flex:1
    },
    {
        field: "power",
        headerName: "power",
        width: '20%',
        align: "right",
        headerAlign: "center",
        flex:1
    }];

function CustomToolbar() {
    return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
    );
}

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

class Biweight_midcorrelation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            initialdataset:[],
            test_data: {
                DataFrame:[]
            },
            //Values selected currently on the form
            selected_method: "bicor",
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
        this.handleTabChange = this.handleTabChange.bind(this);

    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);

        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({column_names: res.data.columns})
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
            this.setState({tabvalue:1})
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
            this.setState({tabvalue:0})
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
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Biweight mid-correlation Parameterisation
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
                    <Grid item xs={9} >
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Results" {...a11yProps(0)} />
                                    <Tab label="Initial Dataset" {...a11yProps(1)} />
                                    {/*<Tab label="New Dataset" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                          zeroMinWidth
                                          rowHeight={40}
                                          className="datagrid"
                                          rows= {this.state.test_data.DataFrame}
                                          columns= {userColumns}
                                          pageSize= {9}
                                          rowsPerPageOptions={[9]}
                                          components={{
                                              Toolbar: CustomToolbar,
                                          }}
                                />
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                            </TabPanel>
                            {/*<TabPanel value={this.state.tabvalue} index={2}>*/}
                            {/*    Item Three*/}
                            {/*</TabPanel>*/}
                        </Box>
                        {/*<div>*/}
                        {/*    <Box*/}
                        {/*            sx={{*/}
                        {/*                display: 'flex',*/}
                        {/*                flexDirection: 'row',*/}
                        {/*                flexWrap: 'wrap',*/}
                        {/*                alignContent: 'center',*/}
                        {/*                justifyContent: 'flex-start',*/}
                        {/*                alignItems: 'center',*/}
                        {/*                p: 1,*/}
                        {/*                m: 1,*/}
                        {/*                bgcolor: 'background.paper',*/}
                        {/*                Width: '95%',*/}
                        {/*                borderRadius: 1,*/}
                        {/*            }}*/}
                        {/*    >*/}
                        {/*        {this.state.test_data.DataFrame.map((item)=>{*/}
                        {/*            return (*/}
                        {/*                    <Card sx={{ minWidth: 100, borderRadius: 2, maxWidth:'33%', m:2}} variant="outlined">*/}
                        {/*                        <CardContent>*/}
                        {/*                            <Typography variant="h5" color="text.secondary" gutterBottom>*/}
                        {/*                                {item.Cor.split("-")[0]}*/}
                        {/*                                <br/>---Vs---*/}
                        {/*                                <br/>{item.Cor.split("-")[1]}*/}
                        {/*                                <br/>*/}
                        {/*                                <hr/>*/}
                        {/*                            </Typography>*/}
                        {/*                            <Typography variant="body1">*/}
                        {/*                                n = {item.n}<br/>*/}
                        {/*                                r = {item.r}<br/>*/}
                        {/*                                CI95% = {item['CI95%']}<br/>*/}
                        {/*                                p-val = {item['p-val']}<br/>*/}
                        {/*                                power = {item.power}<br/>*/}
                        {/*                            </Typography>*/}
                        {/*                        </CardContent>*/}
                        {/*                    </Card>*/}
                        {/*            )})}*/}
                        {/*    </Box>*/}
                        {/*</div>*/}
                    </Grid>
                </Grid>
        )
    }
}

export default Biweight_midcorrelation;
