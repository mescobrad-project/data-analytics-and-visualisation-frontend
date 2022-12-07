/* Imports */
import React from 'react';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_rangeSelector from "@amcharts/amcharts4/plugins/rangeSelector";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";


class ScatterPlot extends React.Component {
    static propTypes = {
        /** Prop "chart_id" provides the id of the chart and needs to be unique in each page */
        chart_id: PropTypes.string,
        /** Prop "chart_data" provides the data of the chart, inside the array there should be an object with two keys
         * xAxis
         * yAxis
         * */
        chart_data: PropTypes.object
    }

    constructor(props) {
        super(props);
        // this.zoomOnUpdate = this.zoomOnUpdate.bind(this);
    }

    createChart() {
        let chart = am4core.create(this.props.chart_id, am4charts.XYChart);

// Create axes
        let valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxisX.title.text = 'X Axis';
        valueAxisX.renderer.minGridDistance = 40;

// Create value axis
        let valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxisY.title.text = 'Y Axis';

// Create series
        let lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.dataFields.valueY = this.chart_data.;
        lineSeries.dataFields.valueX = "ax";
        lineSeries.strokeOpacity = 0;






    }
    render() {
        return (
                <div>
                    <div id={this.props.chart_id} style={{ width: "100%", height: "500px" }}></div>
                    <div id="selectordiv"></div>
                </div>
        )
    }

}
export default ScatterPlot;
