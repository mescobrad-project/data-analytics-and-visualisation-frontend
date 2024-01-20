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
import ProceedButton from "../../components/ui-components/ProceedButton";

class SurvivalAnalysisIncidenceRateRatioSimple extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            // List of columns in dataset
            test_data: {
                status:'',
                result:{incident_rate_ratio:"",
                lower_bound:"",
                upper_bound:"",
                standard_error:""}
            },
            selected_exposed_with: "",
            selected_unexposed_with: "",
            selected_person_time_exposed: "",
            selected_person_time_unexposed: "",
            selected_alpha: 0.05,
            stats_show: false
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectExposedWithChange = this.handleSelectExposedWithChange.bind(this);
        this.handleSelectUnexposedWithChange = this.handleSelectUnexposedWithChange.bind(this);
        this.handleSelectPersonTimeExposedChange = this.handleSelectPersonTimeExposedChange.bind(this);
        this.handleSelectPersonTimeUnexposedChange = this.handleSelectPersonTimeUnexposedChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

        // Send the request
        API.get("incidence_rate_ratio_function",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        exposed_with: this.state.selected_exposed_with,
                        unexposed_with: this.state.selected_unexposed_with,
                        person_time_exposed: this.state.selected_person_time_exposed,
                        person_time_unexposed: this.state.selected_person_time_unexposed,
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
    handleSelectPersonTimeExposedChange(event){
        this.setState( {selected_person_time_exposed: event.target.value})
    }
    handleSelectPersonTimeUnexposedChange(event){
        this.setState( {selected_person_time_unexposed: event.target.value})
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
        window.location.replace("/")
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
                                           inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                           label="Exposed with"
                                           onChange={this.handleSelectExposedWithChange}
                                />
                                <FormHelperText> Count of exposed individuals with outcome.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="Unexposed-with-selector-label"
                                           id="Unexposed-with-selector"
                                           value= {this.state.selected_unexposed_with}
                                           inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                           label="Unexposed with"
                                           onChange={this.handleSelectUnexposedWithChange}
                                />
                                <FormHelperText>Count of unexposed individuals with outcome.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="Exposed-without-selector-label"
                                           id="Exposed-without-selector"
                                           value= {this.state.selected_person_time_exposed}
                                           inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                           label="Exposed without"
                                           onChange={this.handleSelectPersonTimeExposedChange}
                                />
                                <FormHelperText>Person-time contributed by those who were exposed.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="Unexposed-without-selector-label"
                                           id="Unexposed-without-selector"
                                           value= {this.state.selected_person_time_unexposed}
                                           inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                           label="Unexposed without"
                                           onChange={this.handleSelectPersonTimeUnexposedChange}
                                />
                                <FormHelperText>Person-time contributed by those who were unexposed.</FormHelperText>
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
                        <ProceedButton></ProceedButton>
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
                                    Estimated incidence rate ratio = { this.state.test_data.result.incident_rate_ratio}</Typography>
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

export default SurvivalAnalysisIncidenceRateRatioSimple;
