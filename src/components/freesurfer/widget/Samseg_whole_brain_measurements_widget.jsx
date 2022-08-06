import React from 'react';
import NumberFormat from 'react-number-format';
import API from "../../../axiosInstance";
import "./samseg_whole_brain_measurements_widget.scss"
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

class Samseg_whole_brain_measurements_widget extends React.Component {
    requested_hemisphere;
    constructor(props) {
        super(props);
        this.state = {
            // List of data sent by the backend
            whole_brain_measurements_data: []
        };

        this.fetchData = this.fetchData.bind(this);
        this.renderColumnNames = this.renderColumnNames.bind(this);
        this.renderRequestedUrl = this.renderRequestedUrl.bind(this);
        this.renderIconColor = this.renderIconColor.bind(this)
        // Initialise component
        // - values of channels from the backend
        this.requested_hemisphere = this.props.hemisphere;
        this.fetchData();
    }

    /**
     * Call backend endpoint to get whole_brain_measurements
     */
    async fetchData(url = this.renderRequestedUrl(this.requested_hemisphere), config) {
        API.get(url, {}).then(res => {
            this.setState({whole_brain_measurements_data: res.data})
        });
    }
    /**
     * Build requested Url
     */
    renderRequestedUrl = (hemisphere)=>{
        let request_url=''
        switch (hemisphere) {
            case "left":
                request_url = "return_reconall_stats/whole_brain_measurements?hemisphere_requested=left";
                break;
            case "right":
                request_url = "return_reconall_stats/whole_brain_measurements?hemisphere_requested=right";
                break;
            default:
                request_url = "return_reconall_stats/whole_brain_measurements";
        }
        return request_url}
    /**
     * Get columns names
     */
    renderColumnNames = (columnList) => {
        let temp_list = []
        if (!columnList) {columnList=temp_list}
        return(
                columnList.map( (item, index) => {
                    return(
                            <span key={index} className="mr-1 text-default">{index+1}: {item}</span>
                    )
                })
        )
    }

    renderIconColor = (hemisphere) => {
        let icon_color = "red"
        if (hemisphere == 'right')
        { icon_color="green"}
        return icon_color
    }

    render() {
        let tb_data = this.state.whole_brain_measurements_data.map((item) => {
            return (
                    <div className="samseg_whole_brain_measurements_widget">
                        <div className="left">
                            <span className="title">Whole Brain Measurements - {this.requested_hemisphere} hemisphere</span>
                            {/*<p className="left"><strong>key : </strong>{item.subject}</p>*/}
                            <p className="left"><strong>hemisphere : </strong>{item['hemisphere']}</p>
                            <p className="left"><strong>subject : </strong>{item['subject']}</p>
                            <p className="left"><strong>source_basename : </strong>{item['source_basename']}</p>
                            <p className="left"><strong>white_surface_total_area_mm^2 : </strong>
                                <NumberFormat value = {item['white_surface_total_area_mm^2']} thousandSeparator={"."}
                                              decimalSeparator={","} displayType={"text"}/></p>
                            <p className="left"><strong>brain_segmentation_volume_mm^3 : </strong>{item['brain_segmentation_volume_mm^3']}</p>
                            <p className="left"><strong>brain_segmentation_volume_without_ventricles_mm^3 : </strong>{item['brain_segmentation_volume_without_ventricles_mm^3']}</p>
                            <p className="left"><strong>brain_segmentation_volume_without_ventricles_from_surf_mm^3 : </strong>{item['brain_segmentation_volume_without_ventricles_from_surf_mm^3']}</p>
                            <p className="left"><strong>total_cortical_gray_matter_volume_mm^3 : </strong>{item['total_cortical_gray_matter_volume_mm^3']}</p>
                            <p className="left"><strong>supratentorial_volume_mm^3 : </strong>{item['supratentorial_volume_mm^3']}</p>
                            <p className="left"><strong>supratentorial_volume_without_ventricles_mm^3 : </strong>{item['supratentorial_volume_without_ventricles_mm^3']}</p>
                            <p className="left"><strong>estimated_total_intracranial_volume_mm^3 : </strong>{item['estimated_total_intracranial_volume_mm^3']}</p>
                        </div>
                        <div className="right">
                            <PsychologyOutlinedIcon
                                    className="icon"
                                    style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: this.renderIconColor(this.requested_hemisphere)}}
                            />
                        </div>
                    </div>
            )
        })
        return(
                <div className="container">
                    {tb_data}
                </div>

        );
    }
}
export default Samseg_whole_brain_measurements_widget;
