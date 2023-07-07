import React from 'react';
import API from "../../axiosInstance";
import {
    Button, Card, CardContent, Chip,
    FormControl,
    FormHelperText,
    Grid, Input, InputLabel, MenuItem, Select, Tab, Tabs,
    TextField,
    Typography
} from "@mui/material";
import qs from "qs";
import JsonTable from "ts-react-json-table";
import {CSVLink} from "react-csv";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import { Graphviz } from 'graphviz-react';

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

class Structural_Equation_Models_Optimization extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            test_data: {
                status:'',
                fit_results:[],
                graph:""
            },
            graphplot:'',
            //Values selected currently on the form
            created_latent_variables: [],
            selected_measurement_part:[],
            selected_structural_part:[],
            selected_covariances_part:[],
            selected_merged_variables:[],
            selected_rule_type:'',
            create_new_rule:'',
            created_rules: [],
            insert_latent:'',
            selected_file_name: "",
            selected_model: "",
            selected_left_variables:[],
            selected_right_variables: [],
            // Results:[],
            stats_show: false,
            modal_open: false,
            tabvalue:0,
            create_model_checked:false,
            // mod:'# measurement model\n' +
            //         'ind60 =~ x1 + x2 + x3\n' +
            //         'dem60 =~ y1 + y2 + y3 + y4\n' +
            //         'dem65 =~ y5 + y6 + y7 + y8\n' +
            //         '# regressions\n' +
            //         'dem60 ~ ind60\n' +
            //         'dem65 ~ ind60 + dem60\n' +
            //         '# residual correlations\n' +
            //         'y1 ~~ y5\n' +
            //         'y2 ~~ y4 + y6\n' +
            //         'y3 ~~ y7\n' +
            //         'y4 ~~ y8\n' +
            //         'y6 ~~ y8'
            mod:'# measurement model\n' +
                    '# regressions\n' +
                    '# residual correlations\n',
            // svg_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
            //         + '/step_' + params.get("step_id") + '/output/t.svg',
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCreateLatentVariableNameChange = this.handleCreateLatentVariableNameChange.bind(this);
        this.handleSelectedLeftVariableChange = this.handleSelectedLeftVariableChange.bind(this);
        this.handleSelectRightVariableChange = this.handleSelectRightVariableChange.bind(this);
        this.handleSelectRuleTypeChange = this.handleSelectRuleTypeChange.bind(this);
        this.handleMergeVariableLists = this.handleMergeVariableLists.bind(this);
        this.handleInsertLatentChange = this.handleInsertLatentChange.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleDeleteLatentVariable = this.handleDeleteLatentVariable.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleRuleDelete = this.handleRuleDelete.bind(this);
        this.handleCreateModelCheckedChange = this.handleCreateModelCheckedChange.bind(this);
        this.handleCreateRuleTxt = this.handleCreateRuleTxt.bind(this);
        this.handleInsertRuleModel = this.handleInsertRuleModel.bind(this);
        this.handleDeleteAllRules = this.handleDeleteAllRules.bind(this);
        this.fetchFileNames();
    }

    showFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target.result)
            // console.log(text)
            // alert(text)
            this.setState({mod: text})
        };
        reader.readAsText(e.target.files[0])
    }

    async fetchColumnNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
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
    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

        // Send the request
        API.get("SEM_Optimization",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file: this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null,
                        model: this.state.mod,
                        // model: this.state.selected_model,
                    },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({graphplot:res.data.graph});
            this.setState({stats_show: true})
            this.setState({tabvalue:2})
        });
    }

    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        window.location.replace("/")
    }
    handleCreateLatentVariableNameChange(event){
        if (this.state.insert_latent === "" || this.state.insert_latent === null) {
            return;
        }
        var newArray = this.state.created_latent_variables.slice();
        if (newArray.indexOf(this.state.insert_latent) === -1)
        {
            newArray.push(this.state.insert_latent);
        }
        this.setState({created_latent_variables:newArray})
    }
    handleSelectRightVariableChange(event){
        this.setState({selected_right_variables:event.target.value})
    }
    handleSelectedLeftVariableChange(event){
        this.setState({selected_left_variables:event.target.value})
    }
    handleSelectRuleTypeChange(event){
        this.setState({selected_rule_type:event.target.value})
    }
    handleInsertLatentChange(event){
        this.setState( {insert_latent: event.target.value})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.created_latent_variables=[]
            this.state.create_model_checked=false
            this.state.insert_latent=""
        })
    }
    handleDeleteLatentVariable(event) {
        this.setState({created_latent_variables:[]})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleListDelete(event) {
        var newArray = this.state.created_latent_variables.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({created_latent_variables:newList})
    }
    handleCreateModelCheckedChange(event){
        this.setState({create_model_checked: event.target.checked})
        this.setState({mod: ""})
    }
    handleMergeVariableLists(): any[] {
        if(this.state.column_names.length && this.state.created_latent_variables.length) {
            let array1 = this.state.column_names;
            let array2 = this.state.created_latent_variables;
            return [...array1, ...array2];
        }else if (this.state.column_names.length){
            return this.state.column_names
        }else if (this.state.created_latent_variables.length){
            return this.state.created_latent_variables
        }
        return [];
    }
    handleCreateRuleTxt(): any[] {
        var new_rule = this.state.selected_left_variables+" "+this.state.selected_rule_type+" "
        this.state.selected_right_variables.forEach((item, index)=>{
                if (index>0) {
                    new_rule = new_rule + "+" + item
                }
                else{new_rule = new_rule + item}
                })
        return new_rule+'\n'
    }
    handleInsertRuleModel(event){
        var xx = this.handleCreateRuleTxt()
        if (xx === "") {
            return;
        }
        var newArray = this.state.created_rules.slice();
        var new_rule=''
        newArray.forEach((item, index)=>{new_rule = new_rule + item})
        if (newArray.indexOf(xx) === -1)
        {
            newArray.push(xx);
            new_rule = new_rule+xx
        }
        this.setState({created_rules:newArray})
        this.setState({mod:new_rule})
    }
    handleRuleDelete(event) {
        var newArray = this.state.created_rules.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({created_rules:newList})
        var new_rule=''
        var curMod = newList.forEach((item, index)=>{new_rule = new_rule + item})
        this.setState({mod:new_rule})
    }
    handleDeleteAllRules(event){
        this.setState({created_rules:[]})
        this.setState({mod:""})
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            SEM Parameterisation
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
                            <hr/>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Selected Model
                                    </Typography>
                                    <TextField id="filled-multiline-flexible"
                                               multiline
                                               variant="filled"
                                               sx={{width:'100%'}}
                                               value={this.state.mod}/>
                                </CardContent>
                            </Card>
                            <hr/>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_file_name.length < 1 || this.state.mod===""}
                                    type="submit">
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.stats_show}>
                                Proceed >
                            </Button>
                        </form>
                        <br/>
                        <br/>
                        <hr/>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr className="result"/>
                        <Grid sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Import/Create Model" {...a11yProps(1)} />
                                    <Tab label="Results" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                {/*<Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>*/}
                                {/*    <Grid>*/}
                                {/*        /!*<Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >*!/*/}
                                {/*        /!*    Compute the min values of the selected variables. </Typography>*!/*/}
                                {/*        <div style={{textAlign:"center"}}>*/}
                                {/*            <CSVLink data={this.state.Results}*/}
                                {/*                     filename={"Results.csv"}>Download</CSVLink>*/}
                                {/*            <JsonTable className="jsonResultsTable" rows = {this.state.Results}/>*/}
                                {/*        </div>*/}
                                {/*    </Grid>*/}
                                {/*</Grid>*/}
                                {this.state.test_data['status']!=='Success' ? (
                                        <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                            Status :  { this.state.test_data['status']}</Typography>
                                ) : (
                                        <div>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h5" component="div">
                                                        Fitted model optimization results
                                                    </Typography>
                                                    <TextField
                                                            sx={{m: 1, width:'100%'}}
                                                            multiline={5}
                                                            value={this.state.test_data.fit_results}
                                                    />
                                                </CardContent>
                                            </Card>
                                        {this.state.test_data.graph!=="" ? (
                                            <Graphviz dot={this.state.test_data.graph} />
                                                ):(<br/>)}
                                        </div>
                                )}
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <Box>
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.initialdataset}/>
                                </Box>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Box>
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <Grid>
                                                <label className="container"
                                                       style={{
                                                           color: 'royalblue',
                                                           display: 'block',
                                                           position: 'relative',
                                                           paddingLeft: '35px',
                                                           marginBottom: '12px',
                                                           marginTop: '12px',
                                                           cursor: 'pointer',
                                                           fontSize: '22px'
                                                       }}>
                                                    <input style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        height: '25px',
                                                        width: '25px',
                                                        backgroundColor: '#eee'
                                                    }}
                                                           type="checkbox"
                                                           checked={this.state.create_model_checked}
                                                           onChange={this.handleCreateModelCheckedChange}
                                                    />
                                                    Create new Model
                                                </label>
                                            </Grid>
                                            {this.state.create_model_checked===false ? (
                                                    <Grid>
                                                        <Card>
                                                            <CardContent>
                                                                <Typography variant="h5" component="div">
                                                                    Import Model form a file
                                                                </Typography>
                                                                <div style={{paddingTop: '30px'}}>
                                                                    <Input style={{
                                                                        padding: '10px 20px',
                                                                        borderRadius: '10px',
                                                                        color: 'royalblue',
                                                                        cursor: 'pointer',
                                                                        transition: 'background .2s ease-in-out',
                                                                        opacity:5,
                                                                        display: 'block',
                                                                        // position: 'relative',
                                                                        paddingLeft: '35px',
                                                                        // marginBottom: '12px',
                                                                        // marginTop: '12px',
                                                                         fontSize: '14px'}}
                                                                           variant="outlined"
                                                                           type="file" id="myfile" name="myfile"
                                                                           onChange={(e) => this.showFile(e)}
                                                                    />
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ):(
                                                <Grid sx={{paddingTop: '12px'}}>
                                                    <Card>
                                                        <CardContent>
                                                            <Typography variant="h5" component="div">
                                                                Add new rule to the Model
                                                            </Typography>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={5}>
                                                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                                                        <InputLabel id="column-selector-label">Select Variable(s)</InputLabel>
                                                                        <Select
                                                                                labelId="column-selector-label"
                                                                                id="column-selector"
                                                                                multiple
                                                                                value= {this.state.selected_left_variables}
                                                                                label="Select L Variable"
                                                                                onChange={this.handleSelectedLeftVariableChange}
                                                                        >
                                                                            {this.handleMergeVariableLists().map((column) => (
                                                                                    <MenuItem value={column}>{column}</MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                        <FormHelperText>Select variable in the selected dataset.</FormHelperText>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item xs={2}>
                                                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                                                        <InputLabel id="type-selector-label">
                                                                            Select Operator
                                                                        </InputLabel>
                                                                        <Select
                                                                                labelId="type-selector-label"
                                                                                id="type-selector"
                                                                                value= {this.state.selected_rule_type}
                                                                                label="type"
                                                                                onChange={this.handleSelectRuleTypeChange}
                                                                        >
                                                                            <MenuItem value={"=~"}><em>Measurement (=~)</em></MenuItem>
                                                                            <MenuItem value={"~"}><em>Regression (~)</em></MenuItem>
                                                                            <MenuItem value={"~~"}><em>Covariance (~~)</em></MenuItem>
                                                                        </Select>
                                                                        <FormHelperText>Select operator.</FormHelperText>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item xs={5}>
                                                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                                                        <InputLabel id="column-selector-label">
                                                                            Select Variable(s)
                                                                        </InputLabel>
                                                                        <Select
                                                                                labelId="column-selector-label"
                                                                                id="column-selector"
                                                                                multiple
                                                                                value= {this.state.selected_right_variables}
                                                                                label="Select R Variable"
                                                                                onChange={this.handleSelectRightVariableChange}
                                                                        >
                                                                            {this.handleMergeVariableLists().map((column) => (
                                                                                    <MenuItem value={column}>{column}</MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                        <FormHelperText>Select variable in the selected dataset.</FormHelperText>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <TextField
                                                                            sx={{m: 1, width:'60%'}} size={"small"}
                                                                            disabled
                                                                            variant="filled"
                                                                            id="outlined-disabled"
                                                                            label="New Rule"
                                                                            defaultValue="Hello World"
                                                                            value={this.handleCreateRuleTxt()}
                                                                    />
                                                                    <Button size={"small"} variant="contained" onClick={this.handleInsertRuleModel}>
                                                                        Insert rule to the Model
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                                                                    <FormHelperText>List of created rules [click to remove]</FormHelperText>
                                                                    <Grid>
                                                                        <span>
                                                                            {this.state.created_rules.map((column) => (
                                                                                    <Button variant="outlined" size="small"
                                                                                            sx={{m:0.5}} style={{fontSize:'10px'}}
                                                                                            id={column}
                                                                                            onClick={this.handleRuleDelete}>
                                                                                        {column}
                                                                                    </Button>
                                                                            ))}
                                                                        </span>
                                                                    </Grid>
                                                                    <Button onClick={this.handleDeleteAllRules}>
                                                                        Clear all rules
                                                                    </Button>
                                                                </FormControl>
                                                            </Grid>
                                                            {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                                                            {/*    <InputLabel id="column-selector-label">Select Variable</InputLabel>*/}
                                                            {/*    <Select*/}
                                                            {/*            labelId="column-selector-label"*/}
                                                            {/*            id="column-selector"*/}
                                                            {/*            multiple*/}
                                                            {/*            value= {this.state.selected_merged_variables}*/}
                                                            {/*            label="Select Variable"*/}
                                                            {/*            onChange={{}}*/}
                                                            {/*    >*/}
                                                            {/*        {this.handleMergeVariableLists().map((column) => (*/}
                                                            {/*                <MenuItem value={column}>{column}</MenuItem>*/}
                                                            {/*        ))}*/}
                                                            {/*    </Select>*/}
                                                            {/*    <FormHelperText>Select variable in the selected dataset.</FormHelperText>*/}
                                                            {/*</FormControl>*/}
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            )}
                                        </Grid>
                                        <Grid item xs={2}>
                                            {this.state.create_model_checked===true ? (
                                                    <Card style={{marginTop: '50px', marginLeft:'5px'}}>
                                                        <CardContent>
                                                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                                                <TextField
                                                                        labelid="latent-insert-label"
                                                                        id="latent-insert"
                                                                        value= {this.state.insert_latent}
                                                                        label="Insert new latent parameter"
                                                                        onChange={this.handleInsertLatentChange}
                                                                />
                                                                <FormHelperText>Create new latent parameters to use in the model.</FormHelperText>
                                                                <Button size={"small"} variant="contained" onClick={this.handleCreateLatentVariableNameChange}>
                                                                    Create parameter
                                                                </Button>
                                                            </FormControl>
                                                            <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                                                                <FormHelperText>List of created latent parameters [click to remove]</FormHelperText>
                                                                <Grid>
                                                                    <span>
                                                                        {this.state.created_latent_variables.map((column) => (
                                                                                <Button variant="outlined" size="small"
                                                                                        sx={{m:0.5}} style={{fontSize:'10px'}}
                                                                                        id={column}
                                                                                        onClick={this.handleListDelete}>
                                                                                    {column}
                                                                                </Button>
                                                                        ))}
                                                                    </span>
                                                                </Grid>
                                                                <Button onClick={this.handleDeleteLatentVariable}>
                                                                    Clear all
                                                                </Button>
                                                            </FormControl>
                                                        </CardContent>
                                                    </Card>
                                            ):(<br/>)}
                                        </Grid>
                                    </Grid>
                                </Box>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}
export default Structural_Equation_Models_Optimization;
