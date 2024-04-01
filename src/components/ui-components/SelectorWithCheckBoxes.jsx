import React from 'react'
import {Checkbox, FormControl, ListItemIcon, ListItemText, MenuItem, Select} from '@mui/material'
import PropTypes from "prop-types";

class SelectorWithCheckBoxes extends React.Component {
    static propTypes = {
        handleChannelChange: PropTypes.func
    }
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            options:"",
            selectedValues:"",
            isAllSelected:false
        };
        this.setState({options:props})
        console.log(this.state.options)
        this.handleValue=this.handleValue.bind(this)
        // const [selectValue, setSelectValue] = useState([]);
        this.setState({ isAllSelected : this.state.options.length > 0 && this.state.selectedValues.length === this.state.options.length})
    }
    handleValue(e) {
        const value = e.target.value
        if (value.includes('all')) {
            this.setState({selectedValues:this.state.selectedValues.length === this.state.options.length ? [] : this.state.options})
            return;
        }
        this.setState({selectedValues:value})
    }
        // useEffect(() => {
        //     if (Array.isArray(selectLabel) && selectLabel.length > 0) {
        //         document.querySelector('#multi-select').innerHTML = selectLabel.join(", ")
        //     } else if (!Array.isArray(selectLabel)) {
        //         document.querySelector('#multi-select').innerHTML = selectLabel
        //     } else {
        //         document.querySelector('#multi-select').innerHTML = "";
        //     }
        // }, [selectLabel])
    render() {
        return (
                <div>
                    <FormControl sx={{width: '100%'}}>
                        <Select value={this.state.selectedValues} multiple id='multi-select'
                                className='dropdown'
                                onChange={this.handleValue}
                                renderValue={(selected) => {
                                    selected.join(' ')
                                }}>
                            <MenuItem value='all'>
                                <ListItemIcon>
                                    <Checkbox checked={this.state.isAllSelected}></Checkbox>
                                </ListItemIcon>
                                <ListItemText primary="Select All"/>
                            </MenuItem>
                            {this.state.options.map((options) => (
                                    <MenuItem key={{}}>
                                        <ListItemIcon>
                                            <Checkbox
                                                    name='select-checkbox'
                                                    checked={this.state.selectedValues.includes(options)}></Checkbox>
                                        </ListItemIcon>
                                        <ListItemText primary={options}>

                                        </ListItemText>
                                    </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
        )
    }
}
export default SelectorWithCheckBoxes;
