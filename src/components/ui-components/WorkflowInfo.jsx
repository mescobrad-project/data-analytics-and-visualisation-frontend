import React from 'react';
import PropTypes from 'prop-types';

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import {Typography} from "@mui/material";

/**
 * Component returns a range area style am5chart
 */
class WorkflowInfo extends React.Component {
    static propTypes = {
        /* */
        step_name: PropTypes.string,
        step_id: PropTypes.string,
        /* */
        run_id: PropTypes.string,
        run_name: PropTypes.string
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
                <React.Fragment>
                    <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                        Workflow Info
                    </Typography>
                    <hr/>
                    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                        Run name:
                    </Typography>
                    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                        {this.props.run_name}
                    </Typography>
                    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                        Run id:
                    </Typography>
                    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                        {this.props.run_id}
                    </Typography>
                    <hr/>
                    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                        Step id:
                    </Typography>
                    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                        {this.props.step_id}
                    </Typography>
                    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                        Step name:
                    </Typography>
                    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                        {this.props.step_name}
                    </Typography>

                </React.Fragment>
        )
    }
}

export default WorkflowInfo;
