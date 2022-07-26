import "./samsegresults.scss"
import SamsegDatatable from "../../components/freesurfer/datatable/SamsegDatatable"

const List = () => {
    return (
            <div className="list">
                <div className="listContainer">
                    <SamsegDatatable/>
                </div>
            </div>
    )
}
export default List
