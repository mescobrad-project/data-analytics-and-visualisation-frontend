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
import PerfectScrollbar from 'react-perfect-scrollbar';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {GolfCourse} from "@mui/icons-material";

// const root = ReactDOM.createRoot(document.getElementById('root'));
// const element = <h1>Hello, world</h1>;
//     root.render(element);

class SamsegResultsPage extends React.Component {
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
        let tb_data = this.state.whole_brain_measurements_data.map((item) => {
            return (
                    <div>
                        <p><strong>key : </strong>{item.subject}</p>
                        <p><strong>hemisphere : </strong>{item['hemisphere']}</p>
                        <p><strong>subject : </strong>{item['subject']}</p>
                        <p><strong>source_basename : </strong>{item['source_basename']}</p>
                        <p><strong>white_surface_total_area_mm^2 : </strong>
                            <NumberFormat value = {item['white_surface_total_area_mm^2']} thousandSeparator={"."}
                                          decimalSeparator={","} displayType={"text"}/></p>
                        <p><strong>brain_segmentation_volume_mm^3 : </strong>{item['brain_segmentation_volume_mm^3']}</p>
                        <p><strong>brain_segmentation_volume_without_ventricles_mm^3 : </strong>{item['brain_segmentation_volume_without_ventricles_mm^3']}</p>
                        <p><strong>brain_segmentation_volume_without_ventricles_from_surf_mm^3 : </strong>{item['brain_segmentation_volume_without_ventricles_from_surf_mm^3']}</p>
                        <p><strong>total_cortical_gray_matter_volume_mm^3 : </strong>{item['total_cortical_gray_matter_volume_mm^3']}</p>
                        <p><strong>supratentorial_volume_mm^3 : </strong>{item['supratentorial_volume_mm^3']}</p>
                        <p><strong>supratentorial_volume_without_ventricles_mm^3 : </strong>{item['supratentorial_volume_without_ventricles_mm^3']}</p>
                        <p><strong>estimated_total_intracranial_volume_mm^3 : </strong>{item['estimated_total_intracranial_volume_mm^3']}</p>
                    </div>
            )
        })
        return(
                <div className="container">
                <h3>RESULTS</h3>
                    {/*<span className="text-success">Rows: <span className="text-primary"><b>{this.state.whole_brain_measurements_data.rows}</b></span></span>*/}
                    {/*<br/>*/}
                    {/*<span className="text-success">Columns: <span className="text-primary"><b>{this.state.whole_brain_measurements_data.cols}</b></span></span>*/}
                    {/*<br/>*/}
                    {/*<span className="text-success">Column Names:*/}
                    {/*    <span className="text-primary"><b>{this.renderColumnNames(this.state.whole_brain_measurements_data.columns)}*/}
                    {/*        </b>*/}
                    {/*    </span>*/}
                    {/*</span>*/}
                    <Card>
                    {/*    <CardHeader title="Whole brain measurements" />*/}
                    {/*    <PerfectScrollbar>*/}
                    {/*        <Box sx={{ minWidth: 200 }}>*/}
                    {/*            <Table id="example" class="table table-striped table-bordered" cellspacing="0" width="100%">*/}
                    {/*                <TableHead>*/}
                    {/*                <TableRow>*/}
                    {/*                    <th>white_surface_total_area_mm^2</th>*/}
                    {/*                    <th>brain_segmentation_volume_mm^3</th>*/}
                    {/*                    <th>brain_segmentation_volume_without_ventricles_mm^3</th>*/}
                    {/*                    <th>brain_segmentation_volume_without_ventricles_from_surf_mm^3</th>*/}
                    {/*                    <th>total_cortical_gray_matter_volume_mm^3</th>*/}
                    {/*                    <th>supratentorial_volume_mm^3</th>*/}
                    {/*                    <th>supratentorial_volume_without_ventricles_mm^3</th>*/}
                    {/*                    <th>estimated_total_intracranial_volume_mm^3</th>*/}
                    {/*                    <th>subject</th>*/}
                    {/*                    <th>source_basename</th>*/}
                    {/*                    <th>hemisphere</th>*/}
                    {/*                </TableRow>*/}
                    {/*                </TableHead>*/}
                    {/*                <TableBody>*/}
                                    {tb_data}
                    {/*                </TableBody>*/}
                    {/*            </Table>*/}
                    {/*        </Box>*/}
                    {/*</PerfectScrollbar>*/}
                    </Card>
                </div>

        );
    }
}
export default SamsegResultsPage;
