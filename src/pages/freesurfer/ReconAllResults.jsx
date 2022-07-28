import "./reconallresults.scss"
import Widget from "../../components/freesurfer/widget/Widget";
import TableOfReports from "../../components/freesurfer/table/Table";
import Samseg_whole_brain_measurements_widget from "../../components/freesurfer/widget/Samseg_whole_brain_measurements_widget";
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
    render() {
        return(
                <div  className="reconallresults">
                    <div className="reconallContainer">
                        <h3>Cortical Parcellation Stats</h3>
                        <Card>
                            {/*{tb_data}*/}
                        </Card>
                        <div className="widgets">
                            <Samseg_whole_brain_measurements_widget hemisphere="left"/>
                            <Samseg_whole_brain_measurements_widget hemisphere="right"/>
                            <Widget type="whole_brain_measurements_left" />
                            <Widget type="whole_brain_measurements_right" />
                        </div>
                        <div className="listContainer">
                            <div className="listTitle">
                                Maybe - a list of freesurfer files...
                            </div>
                            <TableOfReports/>
                        </div>
                    </div>
                </div>
    )
    }
}
export default ReconAllResults;
