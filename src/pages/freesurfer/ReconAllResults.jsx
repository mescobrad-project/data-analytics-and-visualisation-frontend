import "./reconallresults.scss"
import Samseg_Whole_Brain_Measurements_Widget from "../../components/freesurfer/widget/Samseg_whole_brain_measurements_widget";
import React from 'react';
import ReconallVolumeDatatable from "../../components/freesurfer/datatable/ReconallVolumeDatatable";


function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('../../sample-data', false, /\.(png|jpe?g|svg)$/));


class ReconAllResults extends React.Component {
    render() {
        return(
                <div  className="reconallresults">
                    <div className="reconallContainer">
                        <h3>Cortical Parcellation Stats</h3>
                        <div className="widgets">
                            <Samseg_Whole_Brain_Measurements_Widget hemisphere="left"/>
                            <Samseg_Whole_Brain_Measurements_Widget hemisphere="right"/>
                        </div>
                        <h3>Structural Measurements</h3>
                        <div className="list">
                            <div className="listContainer">
                                <ReconallVolumeDatatable/>
                            </div>
                        </div>
                        <h3>Images - Cortical Measurements</h3>
                        <div className="images">
                            {/*TODO: Retrieve images from the correct folder*/}
                            {images.map(image => (
                                    <img className="image" src={image}/>
                            ))}
                        </div>

                        {/*<div className="listContainer">*/}
                        {/*    <div className="listTitle">*/}
                        {/*        Maybe - a list of freesurfer files...*/}
                        {/*    </div>*/}
                        {/*    <TableOfReports/>*/}
                        {/*</div>*/}

                    </div>
                </div>
    )
    }
}
export default ReconAllResults;
