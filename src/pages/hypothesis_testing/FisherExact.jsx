import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid, InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";

class FisherExact extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            // List of columns in dataset
            test_data: {
                odd_ratio:"",
                p_value:"",
            },
            selected_top_left: "",
            selected_top_right: "",
            selected_bottom_left: "",
            selected_bottom_right: "",
            selected_alternative: "two-sided"
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectTopLeftChange = this.handleSelectTopLeftChange.bind(this);
        this.handleSelectTopRightChange = this.handleSelectTopRightChange.bind(this);
        this.handleSelectBottomLeftChange = this.handleSelectBottomLeftChange.bind(this);
        this.handleSelectBottomRightChange = this.handleSelectBottomRightChange.bind(this);
        this.handleSelectAlternativeChange = this.handleSelectAlternativeChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("fisher",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        variable_top_left: this.state.selected_top_left,
                        variable_top_right: this.state.selected_top_right,
                        variable_bottom_left: this.state.selected_bottom_left,
                        variable_bottom_right: this.state.selected_bottom_right,
                        alternative: this.state.selected_alternative
                        }
                }
        ).then(res => {
            this.setState({test_data: res.data})
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectTopLeftChange(event){
        this.setState( {selected_top_left: event.target.value})
    }
    handleSelectTopRightChange(event){
        this.setState( {selected_top_right: event.target.value})
    }
    handleSelectBottomLeftChange(event){
        this.setState( {selected_bottom_left: event.target.value})
    }
    handleSelectBottomRightChange(event){
        this.setState( {selected_bottom_right: event.target.value})
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
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="top-left-label"
                                           id="top-left-selector"
                                           value= {this.state.selected_top_left}
                                           label="In sample with A"
                                           onChange={this.handleSelectTopLeftChange}
                                />
                                <FormHelperText>The number of “cases” (i.e. occurrence of disease or other event of interest)
                                    among the sample of “exposed” individuals.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="top-right-label"
                                           id="top-right-selector"
                                           value= {this.state.selected_top_right}
                                           label="In sample with Not-A"
                                           onChange={this.handleSelectTopRightChange}
                                />
                                <FormHelperText>Count of unexposed individuals with outcome.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="bottom-left-label"
                                           id="bottom-left-selector"
                                           value= {this.state.selected_bottom_left}
                                           label="Not in sample with A"
                                           onChange={this.handleSelectBottomLeftChange}
                                />
                                <FormHelperText>Count of exposed individuals without outcome.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} >
                                <TextField size={"small"}
                                           labelid="bottom-right-label"
                                           id="bottom-right-selector"
                                           value= {this.state.selected_bottom_right}
                                           label="Not in sample with Not-A"
                                           onChange={this.handleSelectBottomRightChange}
                                />
                                <FormHelperText>Count of unexposed individuals without outcome.</FormHelperText>
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
                        <hr/>
                        <div>
                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >
                                odd_ratio = { this.state.test_data.odd_ratio}</Typography>
                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >
                                p_value = {this.state.test_data.p_value}</Typography>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default FisherExact;
