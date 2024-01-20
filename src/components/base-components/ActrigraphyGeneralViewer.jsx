import React from 'react';
import API from "../../axiosInstance";
// import InnerHTML from 'dangerously-set-html-content'

// import PropTypes from 'prop-types';
import {
    Grid,
    Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import LineMultipleColorsChartCustom from "../ui-components/LineMultipleColorsChartCustom";
import SamsegDatatable from "../freesurfer/datatable/SamsegDatatable";
import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
import ChannelSignalPeaksChartCustom from "../ui-components/ChannelSignalPeaksChartCustom";
import ActigraphyChartCustom from "../ui-components/ActigraphyChartCustom";
import ActigraphyWhitelightChartCustom from "../ui-components/ActigraphyWhitelightChartCustom";
import ActigraphySleepWakeChartCustom from "../ui-components/ActigraphySleepWakeChartCustom";
import ActigraphyGeneralDatatable from "../freesurfer/datatable/ActrigraphyGeneralDatatable";
// import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";

class ActigraphyGeneralViewer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of channels sent by the backend
            chart_data: []
        };

        //Binding functions of the class

        // this.fetchData = this.fetchData.bind(this);
        // Initialise component
        // - values of channels from the backend
        // this.fetchData();
    }


    // async fetchData(url, config) {
    //     API.get("return_actigraphy_general_data", {}).then(res =>
    //     {
    //         console.log("tresultJson")
    //         const resultJson = res.data;
    //         console.log(resultJson)
    //
    //         let temp_chart_data = []
    //         let tempDate =  Date.parse(resultJson[1].date)
    //         // Set number of peak detected to be shown to the user
    //         for ( let it =0 ; it < resultJson.length; it++){
    //             if(it === 0)
    //             {
    //                 continue
    //             }
    //             // if(it === 5)
    //             // {
    //             //     break
    //             // }
    //             let temp_data_dict = {}
    //             // let tempDate =  Date.parse(resultJson[it].date)
    //             // console.log("tempDate")
    //             let temp_date = new Date(parseInt(tempDate) + it*30000 )
    //
    //             // console.log(temp_date)
    //             // let tempDateToPost = new Date(tempDate.getTime() + it*30000)
    //             temp_data_dict["date"] = temp_date
    //             // temp_data_dict["date"] = resultJson[it].date
    //             temp_data_dict["activity"] = parseFloat(resultJson[it].activity)
    //             temp_data_dict["whitelight"] = parseFloat(resultJson[it].whitelight)
    //             if(resultJson[it].sleep_wake==="NaN"){
    //                 temp_data_dict["sleep_wake"]= 0
    //             }else{
    //                 temp_data_dict["sleep_wake"] = parseFloat(resultJson[it].sleep_wake)
    //             }
    //             temp_chart_data.push(temp_data_dict)
    //         }
    //         console.log("temp_chart_data")
    //         console.log(temp_chart_data)
    //         this.setState({chart_data: temp_chart_data})
    //     });
    // }




    render() {
        return (
            <Grid container direction="row">
                <Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Data Preview
                    </Typography>
                    <hr/>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        File Name:
                    </Typography>
                    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        actigraphy_test_data.csv
                    </Typography>
                    <hr/>
                </Grid>
                <Grid item xs={10} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Actigraphy General Viewer
                    </Typography>
                    <hr/>
                    <ActigraphyGeneralDatatable/>
                </Grid>
                {/*<Grid item xs={5} sx={{overflow:"auto"}}>*/}
                {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                {/*        Actigraphy Visualisation*/}
                {/*    </Typography>*/}
                {/*    <hr/>*/}
                {/*    /!*<Typography variant="p" sx={{ flexGrow: 1, display: (this.state.psd_chart_show ? 'block' : 'none')  }} noWrap>*!/*/}
                {/*    /!*    Showing first 1000 entries*!/*/}
                {/*    /!*</Typography>*!/*/}
                {/*    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.psd_chart_show ? 'block' : 'none')  }} noWrap>*/}
                {/*        Results*/}
                {/*    </Typography>*/}
                {/*    <ActigraphyChartCustom chart_id="actigraphy_chart_id" chart_data={ this.state.chart_data}/>*/}
                {/*    <ActigraphyWhitelightChartCustom chart_id="actigraphy_chart_id_2" chart_data={ this.state.chart_data}/>*/}
                {/*    <ActigraphySleepWakeChartCustom chart_id="actigraphy_chart_id_3" chart_data={ this.state.chart_data}/>*/}
                {/*    <Button onClick={this.getSelectionOfSignal} variant="contained" color="primary"*/}
                {/*            sx={{marginLeft: "25%"}}>*/}
                {/*        Get Selection*/}
                {/*    </Button>*/}
                {/*    /!*<div style={{ display: (this.state.signal_chart_show ? 'block' : 'none') }}><LineMultipleColorsChartCustom chart_id="signal_chart_id" chart_data={ this.state.signal_chart_data} highlighted_areas={this.state.signal_chart_highlighted_data}/></div>*!/*/}
                {/*    /!*<hr style={{ display: (this.state.signal_chart_show ? 'block' : 'none') }}/>*!/*/}
                {/*</Grid>*/}
            </Grid>
        )
    }
}

export default ActigraphyGeneralViewer;
