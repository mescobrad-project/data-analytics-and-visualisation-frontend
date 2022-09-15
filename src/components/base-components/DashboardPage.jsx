import React from 'react';
import withRouter from '../withRouter';
import GridLayout from "react-grid-layout";
import {Button, Divider, Typography} from "@mui/material";
import SamsegDatatable from "../freesurfer/datatable/SamsegDatatable";
import PointChartCustom from "../ui-components/PointChartCustom";
import API from "../../axiosInstance";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: "80%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

class DashboardPage extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            periodogram_chart_data: [
                {
                    "category": 0,
                    "yValue": 6.4355746391956735e-12
                },
                {
                    "category": 1,
                    "yValue": 3.1319560431444334e-11
                },
                {
                    "category": 2,
                    "yValue": 4.194519684676876e-12
                },
                {
                    "category": 3,
                    "yValue": 1.0195081813019806e-12
                },
                {
                    "category": 4,
                    "yValue": 2.195746002703263e-12
                },
                {
                    "category": 5,
                    "yValue": 2.4637621246757484e-12
                },
                {
                    "category": 6,
                    "yValue": 1.2012722498801782e-12
                },
                {
                    "category": 7,
                    "yValue": 1.8287549496116968e-12
                },
                {
                    "category": 8,
                    "yValue": 2.736138620547263e-12
                },
                {
                    "category": 9,
                    "yValue": 1.7055062718432134e-13
                },
                {
                    "category": 10,
                    "yValue": 1.3799289603548308e-12
                },
                {
                    "category": 11,
                    "yValue": 3.703991898709516e-12
                },
                {
                    "category": 12,
                    "yValue": 2.1764491127136464e-12
                },
                {
                    "category": 13,
                    "yValue": 9.760132029604134e-13
                },
                {
                    "category": 14,
                    "yValue": 1.2438346121596348e-12
                },
                {
                    "category": 15,
                    "yValue": 2.755635880639563e-14
                },
                {
                    "category": 16,
                    "yValue": 1.0158175234555146e-12
                },
                {
                    "category": 17,
                    "yValue": 2.872638487714049e-13
                },
                {
                    "category": 18,
                    "yValue": 3.340558882271631e-14
                },
                {
                    "category": 19,
                    "yValue": 5.336234196370067e-13
                },
                {
                    "category": 20,
                    "yValue": 1.2168739434351476e-12
                },
                {
                    "category": 21,
                    "yValue": 5.466132176188072e-13
                },
                {
                    "category": 22,
                    "yValue": 1.015127493411335e-13
                },
                {
                    "category": 23,
                    "yValue": 9.353813731617261e-14
                },
                {
                    "category": 24,
                    "yValue": 1.4941233310240093e-13
                },
                {
                    "category": 25,
                    "yValue": 3.73147404527398e-13
                },
                {
                    "category": 26,
                    "yValue": 1.1187163473841093e-13
                },
                {
                    "category": 27,
                    "yValue": 9.444948661009502e-14
                },
                {
                    "category": 28,
                    "yValue": 2.0788890439563375e-14
                },
                {
                    "category": 29,
                    "yValue": 2.4429316471327938e-14
                },
                {
                    "category": 30,
                    "yValue": 9.873862152058426e-14
                },
                {
                    "category": 31,
                    "yValue": 1.7966812297717799e-13
                },
                {
                    "category": 32,
                    "yValue": 2.8546621374081346e-13
                },
                {
                    "category": 33,
                    "yValue": 1.5439844563361888e-13
                },
                {
                    "category": 34,
                    "yValue": 1.776496371762482e-13
                },
                {
                    "category": 35,
                    "yValue": 3.090301829534622e-13
                },
                {
                    "category": 36,
                    "yValue": 1.0511378988510773e-13
                },
                {
                    "category": 37,
                    "yValue": 5.5475602886960496e-14
                },
                {
                    "category": 38,
                    "yValue": 1.1090400097483901e-13
                },
                {
                    "category": 39,
                    "yValue": 1.3750027065251839e-13
                },
                {
                    "category": 40,
                    "yValue": 7.700339319915117e-15
                },
                {
                    "category": 41,
                    "yValue": 4.2107906616674224e-14
                },
                {
                    "category": 42,
                    "yValue": 1.469000854449597e-13
                },
                {
                    "category": 43,
                    "yValue": 2.464227274789938e-14
                },
                {
                    "category": 44,
                    "yValue": 3.440206607793434e-14
                },
                {
                    "category": 45,
                    "yValue": 1.4812006206697124e-14
                },
                {
                    "category": 46,
                    "yValue": 1.9934020928573705e-13
                },
                {
                    "category": 47,
                    "yValue": 1.3708881798817509e-13
                },
                {
                    "category": 48,
                    "yValue": 2.842467821433564e-14
                },
                {
                    "category": 49,
                    "yValue": 3.4667500185592003e-16
                },
                {
                    "category": 50,
                    "yValue": 3.7483704275478374e-15
                },
                {
                    "category": 51,
                    "yValue": 9.963595892731546e-15
                },
                {
                    "category": 52,
                    "yValue": 1.9505149529813988e-14
                },
                {
                    "category": 53,
                    "yValue": 6.575041341399791e-15
                },
                {
                    "category": 54,
                    "yValue": 1.524788783334193e-14
                },
                {
                    "category": 55,
                    "yValue": 6.356631531191096e-14
                },
                {
                    "category": 56,
                    "yValue": 7.275692164753899e-15
                },
                {
                    "category": 57,
                    "yValue": 3.110485782628505e-14
                },
                {
                    "category": 58,
                    "yValue": 5.693179247418684e-14
                },
                {
                    "category": 59,
                    "yValue": 2.2833318581798096e-14
                },
                {
                    "category": 60,
                    "yValue": 4.466950739009611e-14
                },
                {
                    "category": 61,
                    "yValue": 1.6997527116237027e-14
                },
                {
                    "category": 62,
                    "yValue": 2.8363581897536855e-14
                },
                {
                    "category": 63,
                    "yValue": 7.064257737906117e-14
                },
                {
                    "category": 64,
                    "yValue": 3.326041806414739e-15
                },
                {
                    "category": 65,
                    "yValue": 9.89953144385913e-15
                },
                {
                    "category": 66,
                    "yValue": 6.241944383457806e-15
                },
                {
                    "category": 67,
                    "yValue": 2.3629066129366895e-15
                },
                {
                    "category": 68,
                    "yValue": 3.9150360283616855e-15
                },
                {
                    "category": 69,
                    "yValue": 3.524473238772777e-15
                },
                {
                    "category": 70,
                    "yValue": 1.4205925171360523e-15
                },
                {
                    "category": 71,
                    "yValue": 2.7391244391773204e-15
                },
                {
                    "category": 72,
                    "yValue": 1.9781372821277e-15
                },
                {
                    "category": 73,
                    "yValue": 2.7564169319185894e-16
                },
                {
                    "category": 74,
                    "yValue": 2.0299707009474962e-16
                },
                {
                    "category": 75,
                    "yValue": 2.905755135314781e-16
                },
                {
                    "category": 76,
                    "yValue": 2.2754305376361543e-16
                },
                {
                    "category": 77,
                    "yValue": 1.413677771434592e-16
                },
                {
                    "category": 78,
                    "yValue": 4.356118062410332e-17
                },
                {
                    "category": 79,
                    "yValue": 1.2203503065865114e-17
                },
                {
                    "category": 80,
                    "yValue": 1.6367512093967015e-18
                },
                {
                    "category": 81,
                    "yValue": 7.698497649564166e-18
                },
                {
                    "category": 82,
                    "yValue": 9.388353238677259e-17
                },
                {
                    "category": 83,
                    "yValue": 4.8552599457356236e-17
                },
                {
                    "category": 84,
                    "yValue": 7.999543238957449e-17
                },
                {
                    "category": 85,
                    "yValue": 8.27111304403293e-17
                },
                {
                    "category": 86,
                    "yValue": 9.546537936971006e-19
                },
                {
                    "category": 87,
                    "yValue": 2.366364790777836e-17
                },
                {
                    "category": 88,
                    "yValue": 6.380863576575735e-18
                },
                {
                    "category": 89,
                    "yValue": 1.3232505682265586e-17
                },
                {
                    "category": 90,
                    "yValue": 1.985032362138491e-17
                },
                {
                    "category": 91,
                    "yValue": 2.5486059007010273e-17
                },
                {
                    "category": 92,
                    "yValue": 6.73043392521669e-17
                },
                {
                    "category": 93,
                    "yValue": 3.293038404352827e-17
                },
                {
                    "category": 94,
                    "yValue": 4.31999066448173e-17
                },
                {
                    "category": 95,
                    "yValue": 8.189532052399858e-17
                },
                {
                    "category": 96,
                    "yValue": 1.0730498282361989e-16
                },
                {
                    "category": 97,
                    "yValue": 4.706112205774845e-17
                },
                {
                    "category": 98,
                    "yValue": 4.052074954453928e-18
                },
                {
                    "category": 99,
                    "yValue": 4.1021528886344116e-18
                },
                {
                    "category": 100,
                    "yValue": 1.6525491473558422e-17
                },
                {
                    "category": 101,
                    "yValue": 4.7936415863703523e-17
                },
                {
                    "category": 102,
                    "yValue": 6.608917141928358e-17
                },
                {
                    "category": 103,
                    "yValue": 8.686490157185452e-17
                },
                {
                    "category": 104,
                    "yValue": 1.2378516508863473e-17
                },
                {
                    "category": 105,
                    "yValue": 1.0168736319592375e-17
                },
                {
                    "category": 106,
                    "yValue": 3.9601887070584495e-18
                },
                {
                    "category": 107,
                    "yValue": 3.926427057901227e-18
                },
                {
                    "category": 108,
                    "yValue": 1.9235614530353974e-17
                },
                {
                    "category": 109,
                    "yValue": 1.340069705791573e-17
                },
                {
                    "category": 110,
                    "yValue": 2.9677724428938795e-17
                },
                {
                    "category": 111,
                    "yValue": 8.010339869806663e-17
                },
                {
                    "category": 112,
                    "yValue": 2.2295028620364653e-18
                },
                {
                    "category": 113,
                    "yValue": 5.713487067869716e-17
                },
                {
                    "category": 114,
                    "yValue": 3.0973339195865186e-17
                },
                {
                    "category": 115,
                    "yValue": 5.6201548420417556e-18
                },
                {
                    "category": 116,
                    "yValue": 4.685851597738329e-17
                },
                {
                    "category": 117,
                    "yValue": 5.851180513567743e-17
                },
                {
                    "category": 118,
                    "yValue": 1.5630057553742175e-17
                },
                {
                    "category": 119,
                    "yValue": 2.5062032339470175e-17
                },
                {
                    "category": 120,
                    "yValue": 2.6629809190102752e-17
                },
                {
                    "category": 121,
                    "yValue": 1.6155013148539688e-17
                },
                {
                    "category": 122,
                    "yValue": 5.327888163128829e-18
                },
                {
                    "category": 123,
                    "yValue": 1.0521847671940123e-17
                },
                {
                    "category": 124,
                    "yValue": 2.169028584967476e-17
                },
                {
                    "category": 125,
                    "yValue": 1.0844720015198633e-17
                },
                {
                    "category": 126,
                    "yValue": 2.9881369347895805e-18
                },
                {
                    "category": 127,
                    "yValue": 4.1189893388065123e-17
                },
                {
                    "category": 128,
                    "yValue": 2.65989684127144e-17
                }
            ],
            layout :[
                { i: "a", x: 0, y: 0, w: 1, h: 1 },
                { i: "b", x: 1, y: 0, w: 4, h: 5 },
                { i: "c", x: 5, y: 0, w: 3, h: 4 },
                { i: "d", x: 8, y: 0, w: 3, h: 3 }
            ]
        };

        this.init_stuff = this.init_stuff.bind(this);

        this.init_stuff()
    }


    init_stuff(){
        API.get("return_periodogram",
                {
                    params: { input_name: "Fp2-AV", input_window: "hann", input_nfft: 256, input_return_onesided: true, input_scaling: "density", input_axis: "-1" }
                }
        ).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')
            let temp_array_peridogram = []
            for ( let it =0 ; it < resultJson['power spectral density'].length; it++){
                let temp_object = {}
                temp_object["category"] = resultJson['frequencies'][it]
                temp_object["yValue"] = resultJson['power spectral density'][it]
                temp_array_peridogram.push(temp_object)
            }
            console.log("temp_array_peridogram")
            console.log(temp_array_peridogram)


            this.setState({peridogram_chart_data: temp_array_peridogram})
        });
    }
    render() {
        return (
                <GridLayout
                        className="layout"
                        layout={this.state.layout}
                        cols={12}
                        // compactType={'vertical'}
                        autosize={true}
                        rowHeight={30}
                        rowHeight={200}
                        width={ window.innerWidth}
                        isResizable={true}
                        isDragable={false}
                        allowOverlap={false}
                >
                    <div style={{border: "1px solid black"}} key="a">
                        <div style={{ width: "100%", height: "3%", backgroundColor: "#1976d2"}}></div>
                        <div style={{ width: "100%", height: "97%", float:"left", backgroundColor: "lightgray"}}>
                            <Typography>
                                Workflow Name: "Test Workflow #1"
                            </Typography>
                            <Divider/>
                            <Typography>
                                Workflow Description: "Lorem Ipsum"
                            </Typography>
                            <Divider/>
                        </div>
                        {/*<Button variant="contained" color="secondary"*/}
                        {/*        sx={{margin: "8px", float: "right"}}>*/}
                        {/*    Apply Changes> A*/}
                        {/*</Button>*/}
                    </div>
                    <div style={{border: "1px solid black"}} key="b">
                        <div style={{ width: "100%", height: "3%", backgroundColor: "#1976d2"}}></div>
                        <div style={{ width: "20%", height: "97%", float:"left", backgroundColor: "lightgray"}}>
                            <Typography>
                                Step Name: "EEG Plot"
                            </Typography>
                            <Divider/>
                            <Typography>
                                Step Description: "Lorem Ipsum"
                            </Typography>
                            <Divider/>
                        </div>
                        <iframe src="http://localhost:8080/#/?username=user&password=password&hostname=Desktop Auto-Resolution" style={{width: "80%", height: "97%" , marginLeft: "0%"}}></iframe>
                    </div>
                    <div style={{border: "1px solid black"}} key="c">
                        <div style={{ width: "100%", height: "3%", backgroundColor: "#1976d2"}}></div>
                        <div style={{ width: "20%", height: "97%", float:"left", backgroundColor: "lightgray"}}>
                            <Typography>
                                Step Name: "Samseg Results"
                            </Typography>
                            <Divider/>
                            <Typography>
                                Step Description: "Lorem Ipsum"
                            </Typography>
                            <Divider/>
                        </div>
                        <div style={{ width: "80%", float:"left", height: "97%"}}>
                            <SamsegDatatable/>
                        </div>
                        {/*<Button variant="contained" color="secondary"*/}
                        {/*        sx={{margin: "8px", float: "right"}}>*/}
                        {/*    Apply Changes> C*/}
                        {/*</Button>*/}
                    </div>
                    <div style={{border: "1px solid black"}} key="d">
                        <div style={{ width: "100%", height: "3%", backgroundColor: "#1976d2"}}></div>
                        <div style={{ width: "20%", height: "97%", float:"left", backgroundColor: "lightgray"}}>
                            <Typography>
                                Step Name: "Periodogram Results"
                            </Typography>
                            <Divider/>
                            <Typography>
                                Step Description: "Lorem Ipsum"
                            </Typography>
                            <Divider/>
                        </div>
                        <div style={{ width: "80%", float:"left", height: "97%"}}>
                            <PointChartCustom chart_id="peridogram_chart_id" chart_data={ this.state.periodogram_chart_data}/>
                        </div>
                        {/*<Button variant="contained" color="secondary"*/}
                        {/*        sx={{margin: "8px", float: "right"}}>*/}
                        {/*    Apply Changes> C*/}
                        {/*</Button>*/}
                    </div>
                </GridLayout>
        )
    }
}

export default withRouter(DashboardPage);
