import "./reconallresults.scss"
import Widget from "../../components/freesurfer/widget/Widget";
import TableOfReports from "../../components/freesurfer/table/Table";
import React from 'react';
import NumberFormat from 'react-number-format';
import API from "../../axiosInstance";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip
} from '@mui/material';


// const reconAllResults=()=>{
class ReconAllResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // List of data sent by the backend
            whole_brain_measurements_data: []
        };
        //Binding functions of the class
        this.fetchData = this.fetchData.bind(this);
        this.renderColumnNames = this.renderColumnNames.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchData();
    }

    /**
     * Call backend endpoint to get channels of eeg
     */
    async fetchData(url, config) {
        API.get("return_samseg_stats/whole_brain_measurements?hemisphere_requested=left", {}).then(res => {
            this.setState({whole_brain_measurements_data: res.data})
        });
    }
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

    render() {
        // let tb_data = this.state.whole_brain_measurements_data.map((item) => {
        //     return (
        //             <div>
        //                 <p><strong>key : </strong>{item.subject}</p>
        //                 <p><strong>hemisphere : </strong>{item['hemisphere']}</p>
        //                 <p><strong>subject : </strong>{item['subject']}</p>
        //                 <p><strong>source_basename : </strong>{item['source_basename']}</p>
        //                 <p><strong>white_surface_total_area_mm^2 : </strong>
        //                     <NumberFormat value = {item['white_surface_total_area_mm^2']} thousandSeparator={"."}
        //                                   decimalSeparator={","} displayType={"text"}/></p>
        //                 <p><strong>brain_segmentation_volume_mm^3 : </strong>{item['brain_segmentation_volume_mm^3']}</p>
        //                 <p><strong>brain_segmentation_volume_without_ventricles_mm^3 : </strong>{item['brain_segmentation_volume_without_ventricles_mm^3']}</p>
        //                 <p><strong>brain_segmentation_volume_without_ventricles_from_surf_mm^3 : </strong>{item['brain_segmentation_volume_without_ventricles_from_surf_mm^3']}</p>
        //                 <p><strong>total_cortical_gray_matter_volume_mm^3 : </strong>{item['total_cortical_gray_matter_volume_mm^3']}</p>
        //                 <p><strong>supratentorial_volume_mm^3 : </strong>{item['supratentorial_volume_mm^3']}</p>
        //                 <p><strong>supratentorial_volume_without_ventricles_mm^3 : </strong>{item['supratentorial_volume_without_ventricles_mm^3']}</p>
        //                 <p><strong>estimated_total_intracranial_volume_mm^3 : </strong>{item['estimated_total_intracranial_volume_mm^3']}</p>
        //             </div>
        //     )
        // })
        return(
                <div  className="reconallresults">
                <div className="reconallContainer">
                    {/*<h3>RESULTS</h3>*/}
                    {/*<Card>*/}
                    {/*    {tb_data}*/}
                    {/*</Card>*/}
                    <div className="widgets">
                        <Widget type="user" />
                        <Widget type="order" />
                        <Widget type="earning" />
                        <Widget type="balance" />
                    </div>
                    <div className="listContainer">
                        <div className="listTitle">
                            Maybe - a list of freesurfer files...
                        </div>
                        <TableOfReports/>
                    </div>
                </div></div>
    )
    }
}
export default ReconAllResults;
