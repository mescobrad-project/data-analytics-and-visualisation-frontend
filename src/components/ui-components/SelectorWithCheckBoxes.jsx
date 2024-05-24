import React, {useState} from 'react'
import {
    Checkbox,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select
} from '@mui/material'

const SelectorWithCheckBoxes = ({data, onChildClick}) =>{
    const options = data.length > 0 ? data : []
    const [selected, setSelected] = useState([]);
    const isAllSelected =
        options.length > 0 && selected.length === options.length

    const handleChange = (event) => {
        const value = event.target.value
        if (value[value.length - 1]==='all') {
            setSelected(selected.length === options.length ? [] : options)
            onChildClick(selected.length === options.length ? [] : options)
            return;
        }
        setSelected(value)
        onChildClick(value)
    };
    return (
            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                <InputLabel id="mutiple-select-label">Select Variables</InputLabel>
                <Select value={selected}
                        multiple
                        label="Select Variable"
                        labelId='multi-select'
                        className='dropdown'
                        onChange={handleChange}
                        renderValue={(selected) =>
                            selected.join(", ")
                        }>
                    <MenuItem value='all'>
                        <ListItemIcon>
                            <Checkbox checked={isAllSelected}></Checkbox>
                        </ListItemIcon>
                        <ListItemText primary="Select All"/>
                    </MenuItem>
                    {options.map((option) => (
                            <MenuItem key={option} value={option}>
                                <ListItemIcon>
                                    <Checkbox
                                            name='select-checkbox'
                                            checked={selected.indexOf(option)>-1}></Checkbox>
                                </ListItemIcon>
                                <ListItemText primary={option}>

                                </ListItemText>
                            </MenuItem>
                    ))}
                </Select>
                <FormHelperText>Select Variables</FormHelperText>
            </FormControl>
        )
    }

export default SelectorWithCheckBoxes;
