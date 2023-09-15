import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    TextField,
    Typography
} from "@mui/material";

class SurvivalAnalysisNNTSimple extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            // List of columns in dataset
            test_data: {
                status:'',
                result:{
                    nnt:"",
                    lower_bound:"",
                    upper_bound:"",
                    standard_error:""}
            },
            selected_exposed_with: "",
            selected_unexposed_with: "",
            selected_exposed_without: "",
            selected_unexposed_without: "",
            selected_alpha: 0.05,
            stats_show: false
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectExposedWithChange = this.handleSelectExposedWithChange.bind(this);
        this.handleSelectUnexposedWithChange = this.handleSelectUnexposedWithChange.bind(this);
        this.handleSelectExposedWithoutChange = this.handleSelectExposedWithoutChange.bind(this);
        this.handleSelectUnexposedWithoutChange = this.handleSelectUnexposedWithoutChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

        // Send the request
        API.get("number_needed_to_treat_function",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        exposed_with: this.state.selected_exposed_with,
                        unexposed_with: this.state.selected_unexposed_with,
                        exposed_without: this.state.selected_exposed_without,
                        unexposed_without: this.state.selected_unexposed_without,
                        alpha: this.state.selected_alpha
                        }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({stats_show: true})
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectExposedWithChange(event){
        this.setState( {selected_exposed_with: event.target.value})
    }
    handleSelectUnexposedWithChange(event){
        this.setState( {selected_unexposed_with: event.target.value})
    }
    handleSelectExposedWithoutChange(event){
        this.setState( {selected_exposed_without: event.target.value})
    }
    handleSelectUnexposedWithoutChange(event){
        this.setState( {selected_unexposed_without: event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }
    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        API.get("/task/complete", {
            params: {
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
            }

    }).then(res => {
            window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
        });
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
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="exposed-with-selector-label"
                                           id="exposed-with-selector"
                                           value= {this.state.selected_exposed_with}
                                           label="Exposed with"
                                           inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                           onChange={this.handleSelectExposedWithChange}
                                />
                                <FormHelperText>The number of “cases” (i.e. occurrence of disease or other event of interest)
                                    among the sample of “exposed” individuals.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="Unexposed-with-selector-label"
                                           id="Unexposed-with-selector"
                                           value= {this.state.selected_unexposed_with}
                                           label="Unexposed with"
                                           inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                           onChange={this.handleSelectUnexposedWithChange}
                                />
                                <FormHelperText>Count of unexposed individuals with outcome.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="Exposed-without-selector-label"
                                           id="Exposed-without-selector"
                                           value= {this.state.selected_exposed_without}
                                           label="Exposed without"
                                           inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                           onChange={this.handleSelectExposedWithoutChange}
                                />
                                <FormHelperText>Count of exposed individuals without outcome.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="Unexposed-without-selector-label"
                                           id="Unexposed-without-selector"
                                           value= {this.state.selected_unexposed_without}
                                           label="Unexposed without"
                                           inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                           onChange={this.handleSelectUnexposedWithoutChange}
                                />
                                <FormHelperText>Count of unexposed individuals without outcome.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="alpha-selector-label"
                                           id="alpha-selector"
                                           value= {this.state.selected_alpha}
                                           label="alpha"
                                           onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>Alpha value to calculate two-sided Wald confidence intervals.</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.stats_show || !(this.state.test_data.status==='Success')}>
                                Proceed >
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                            <Grid style={{display: (this.state.test_data['status']!=='Success' ? 'block' : 'none')}}>
                                <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                            </Grid>
                            <Grid style={{display: (this.state.test_data['status']==='Success' ? 'block' : 'none')}}>
                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >
                                    Estimated number needed to treat = { this.state.test_data.result.nnt}</Typography>
                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >
                                    Lower bound = {this.state.test_data.result.lower_bound}</Typography>
                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >
                                    Upper bound = {this.state.test_data.result.upper_bound}</Typography>
                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >
                                    Standard error = {this.state.test_data.result.standard_error}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}

export default SurvivalAnalysisNNTSimple;
