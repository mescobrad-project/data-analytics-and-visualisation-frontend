import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    Button, Card, CardContent,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, Tab,
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
import Paper from "@mui/material/Paper";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import Plot from "react-plotly.js";
import {CSVLink} from "react-csv";

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

class TSNE extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // List of columns sent by the backend
            column_names: [],
            file_names:[],
            //Values selected currently on the form
            selected_column: "",
            selected_file_name: "",
            selected_categorical_column:'',
            selected_n_components_1: 2,
            selected_n_iter:1000,
            selected_perplexity:50,
            selected_early_exaggeration:12,
            selected_init:'pca',
            selected_method:'barnes_hut',
            selected_categorical_variable: '',
            selected_independent_variables: '',
            selected_independent_variables_wf: [],
            test_data:{
                transformed:"",
                embeddings_vector:"",
                Kullback_Leibler:""
            },
            Transformed_cols:"",
            Embeddings_vector:"",
            // Hide/show results
            TSNE_show : false,
            svg1_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/PCA.svg',
        };

        //Binding functions of the class
        this.handleSelectNComponents1Change = this.handleSelectNComponents1Change.bind(this);
        this.handleSelectN_iterChange = this.handleSelectN_iterChange.bind(this);
        this.handleSelectPerplexityChange = this.handleSelectPerplexityChange.bind(this);
        this.handleSelectEarly_exaggerationChange = this.handleSelectEarly_exaggerationChange.bind(this);
        this.handleSelectInitChange = this.handleSelectInitChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.handleSelectCategoricalColumnChange = this.handleSelectCategoricalColumnChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);this.handleListDelete = this.handleListDelete.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.debug = this.debug.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchFileNames();
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
        this.setState({TSNE_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("tsne", {
                    params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        n_components_1: this.state.selected_n_components_1,
                        n_iter: this.state.selected_n_iter,
                        perplexity:this.state.selected_perplexity,
                        early_exaggeration:this.state.selected_early_exaggeration,
                        init:this.state.selected_init,
                        method:this.state.selected_method,
                        categorical_variable:this.state.selected_categorical_variable,
                        independent_variables: this.state.selected_independent_variables_wf},
                paramsSerializer : params => {
                    return qs.stringify(params, { arrayFormat: "repeat" })
                }
        }).then(res => {
            this.setState({test_data: res.data})
            this.setState({Transformed_cols: JSON.parse(res.data.transformed)})
            this.setState({Embeddings_vector: JSON.parse(res.data.embeddings_vector)})
            this.setState({TSNE_show: true})
            this.setState({tabvalue:1})
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
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({column_names: res.data.columns})
        });
    }
    async fetchFileNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_all_files",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({file_names: res.data.files})
        });
    }
    async fetchDatasetContent() {
        const params = new URLSearchParams(window.location.search);
        API.get("return_dataset",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
            this.setState({tabvalue:0})
        });
    }
    resetResultArea(){
        this.setState({TSNE_show: false})
    }
    handleSelectNComponents1Change(event){
        this.setState( {selected_n_components_1: event.target.value})
        this.resetResultArea()
    }
    handleSelectN_iterChange(event){
        this.setState( {selected_n_iter: event.target.value})
        this.resetResultArea()
    }
    handleSelectPerplexityChange(event){
        this.setState( {selected_perplexity: event.target.value})
        this.resetResultArea()
    }
    handleSelectEarly_exaggerationChange(event){
        this.setState( {selected_early_exaggeration: event.target.value})
        this.resetResultArea()
    }
    handleSelectInitChange(event){
        this.setState( {selected_init: event.target.value})
        this.resetResultArea()
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
        this.resetResultArea()
    }

    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
        var newArray = this.state.selected_independent_variables_wf.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables_wf:newArray})
        this.resetResultArea()
    }
    handleSelectCategoricalColumnChange(event){
        this.setState( {selected_categorical_column: event.target.value})
        this.setState( {selected_categorical_variable: this.state.selected_file_name+"--"+event.target.value})
        this.resetResultArea()
    }
    handleListDelete(event) {
        var newArray = this.state.selected_independent_variables_wf.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_independent_variables_wf:newList})
    }
    handleDeleteVariable(event) {
        this.setState({selected_independent_variables_wf:[]})
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.handleDeleteVariable()
            this.resetResultArea()
        })
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        // We changed info file uploading process to the DataLake
        // const file_to_output= window.localStorage.getItem('MY_APP_STATE');
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        console.log(this.state.output_return_data);
        window.location.replace("/")
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            TSNE analysis Parameterisation
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="file-selector-label">File</InputLabel>
                                <Select
                                        labelId="file-selector-label"
                                        id="file-selector"
                                        value= {this.state.selected_file_name}
                                        label="File Variable"
                                        onChange={this.handleSelectFileNameChange}
                                >
                                    {this.state.file_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select dataset.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="categorical-selector-label">Categorical variable</InputLabel>
                                <Select
                                        labelId="categorical-selector-label"
                                        id="categorical-selector"
                                        value= {this.state.selected_categorical_column}
                                        label="Categorical variable"
                                        onChange={this.handleSelectCategoricalColumnChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Column for Normality test</FormHelperText>
                            </FormControl>
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
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="n_iter-label"
                                        id="n_iter-selector"
                                        value= {this.state.selected_n_iter}
                                        label="SVD solver"
                                        onChange={this.handleSelectN_iterChange}
                                        type="number"
                                >
                                </TextField>
                                <FormHelperText>Maximum number of iterations for the optimization.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="perplexity-label"
                                        id="perplexity-selector"
                                        value= {this.state.selected_perplexity}
                                        label="Perplexity"
                                        onChange={this.handleSelectPerplexityChange}
                                        type="number"
                                />
                                <FormHelperText>The perplexity is related to the number of nearest neighbors that is used in other manifold learning algorithms. </FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="early_exaggeration-label"
                                        id="early_exaggeration-selector"
                                        value= {this.state.selected_early_exaggeration}
                                        label="Early exaggeration"
                                        onChange={this.handleSelectEarly_exaggerationChange}
                                        type="number"
                                />
                                <FormHelperText>Controls how tight natural clusters in the original space are in the embedded space and how much space will be between them.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="init-label">Init</InputLabel>
                                <Select
                                        labelId="init-label"
                                        id="init-selector"
                                        value= {this.state.selected_init}
                                        label="Init"
                                        onChange={this.handleSelectInitChange}
                                        // type="number"
                                >
                                    <MenuItem value={"random"}><em>random</em></MenuItem>
                                    <MenuItem value={"pca"}><em>pca</em></MenuItem>
                                </Select>
                                <FormHelperText>The gradient calculation algorithm uses 'Barnes-Hut' approximation running in O(NlogN) time, or 'exact' running in O(N^2) time.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="method-label">Method</InputLabel>
                                <Select
                                        labelId="method-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="SVD solver"
                                        onChange={this.handleSelectMethodChange}
                                        // type="number"
                                >
                                    <MenuItem value={"barnes_hut"}><em>barnes_hut</em></MenuItem>
                                    <MenuItem value={"exact"}><em>exact</em></MenuItem>
                                </Select>
                                <FormHelperText>The gradient calculation algorithm uses 'Barnes-Hut' approximation running in O(NlogN) time, or 'exact' running in O(N^2) time.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Columns</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables}
                                        // multiple
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Independent Variables</FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.TSNE_show || !(this.state.test_data.status==='Success')}>
                                Proceed
                            </Button>
                        </form>
                        <br/>
                        <br/>
                        <hr/>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected Training vectors [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_independent_variables_wf.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleListDelete}>
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                            </div>
                            <Button onClick={this.handleDeleteVariable}>
                                Clear all
                            </Button>
                        </FormControl>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            TSNE analysis Result
                        </Typography>
                        <hr class="result"/>
                        <Grid sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    <Tab label="Components" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                {this.state.test_data['status']!=='Success' ? (
                                        <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                ) : (
                                    <Grid container direction="row">
                                        <Grid sx={{ flexGrow: 1}} >
                                            <div style={{ display: (this.state.TSNE_show ? 'block' : 'none') }}>
                                                <Card style={{ display: (this.state.TSNE_show ? 'block' : 'none'), padding:'5px' }}>
                                                    <CardContent sx={{m: 1, width:'100%', alignContent:'center'}}>
                                                        <Typography variant="h5" component="div">
                                                            Kullback-Leibler divergence after optimization. </Typography>
                                                        {Number.parseFloat(this.state.test_data.Kullback_Leibler).toFixed(6)}
                                                    </CardContent>
                                                </Card>
                                                <Card style={{ display: (this.state.TSNE_show ? 'block' : 'none'), padding:'5px' }}>
                                                    <CardContent sx={{m: 1, width:'100%', alignContent:'center'}}>
                                                        <Typography variant="h5" component="div">
                                                            Embeddings_vector. </Typography>
                                                        <JsonTable className="jsonResultsTable"
                                                                   rows = {this.state.Embeddings_vector}/>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <Grid item xs={12} style={{ display: 'inline-block', padding:'20px'}}>
                                                <Card style={{ display: (this.state.TSNE_show ? 'block' : 'none') }}>
                                                    <CardContent sx={{m: 1, width:'100%', alignContent:'center'}}>
                                                        <Typography variant="h5" component="div">
                                                            Components. </Typography>
                                                        <img src={this.state.svg1_path + "?random=" + new Date().getTime()}
                                                                // srcSet={this.state.svg1_path + "?random=" + new Date().getTime() +'?w=100&h=100&fit=crop&auto=format&dpr=2 2x'}
                                                             loading="lazy"
                                                             style={{width: '100%'}}
                                                                // style={{zoom:'70%'}}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )}
                                <hr className="result" style={{display: (this.state.stats_show ? 'block' : 'none')}}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <Box>
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.initialdataset}/>
                                </Box>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                <Box>
                                    <CSVLink data={this.state.Transformed_cols}
                                             filename="TSNE.csv">Download</CSVLink>
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.Transformed_cols}/>
                                </Box>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}

export default TSNE;
