import React from 'react';
import API from "../../axiosInstance";

// const root = ReactDOM.createRoot(document.getElementById('root'));
// const element = <h1>Hello, world</h1>;
//     root.render(element);

class SamsegResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // List of channels sent by the backend
            list: [],
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
        API.get("return_samseg_stats/whole_brain_measurements", {}).then(res => {
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
                    <tr key={item['hemisphere']}>
                        <td>{item['white_surface_total_area_mm^2']}</td>
                        <td>{item['brain_segmentation_volume_mm^3']}</td>
                        <td>{item['brain_segmentation_volume_without_ventricles_mm^3']}</td>
                        <td>{item['brain_segmentation_volume_without_ventricles_from_surf_mm^3']}</td>
                        <td>{item['total_cortical_gray_matter_volume_mm^3']}</td>
                        <td>{item['supratentorial_volume_mm^3']}</td>
                        <td>{item['supratentorial_volume_without_ventricles_mm^3']}</td>
                        <td>{item['estimated_total_intracranial_volume_mm^3']}</td>
                        <td>{item['subject']}</td>
                        <td>{item['source_basename']}</td>
                        <td>{item['hemisphere']}</td>
                    </tr>
            )
        })
        return(
                <div className="container">
                    <h3>RESULTS</h3>
                    <span className="text-success">Rows: <span className="text-primary"><b>{this.state.whole_brain_measurements_data.rows}</b></span></span>
                    <br/>
                    <span className="text-success">Columns: <span className="text-primary"><b>{this.state.whole_brain_measurements_data.cols}</b></span></span>
                    <br/>
                    <span className="text-success">Column Names:
                        <span className="text-primary"><b>{this.renderColumnNames(this.state.whole_brain_measurements_data.columns)}
                            </b>
                        </span>
                    </span>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>white_surface_total_area_mm^2</th>
                            <th>brain_segmentation_volume_mm^3</th>
                            <th>brain_segmentation_volume_without_ventricles_mm^3</th>
                            <th>brain_segmentation_volume_without_ventricles_from_surf_mm^3</th>
                            <th>total_cortical_gray_matter_volume_mm^3</th>
                            <th>supratentorial_volume_mm^3</th>
                            <th>supratentorial_volume_without_ventricles_mm^3</th>
                            <th>estimated_total_intracranial_volume_mm^3</th>
                            <th>subject</th>
                            <th>source_basename</th>
                            <th>hemisphere</th>
                        </tr>
                        </thead>
                        <tbody>
                            {tb_data.rowData}
                        </tbody>
                    </table>
                </div>
        );
    }
}
export default SamsegResultsPage;
