import React from 'react';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
/**
 * Component returns an lollipop style am5chart
 * Intented to be used to show an array of data usually in linear order but can be used in different manners
 */
class PointChartCustomAM4 extends React.Component {
    static propTypes = {
        /** Prop "chart_id" provides the id of the chart and needs to be unique in each page */
        chart_id: PropTypes.string,
        /** Prop "chart_data" provides the data of the chart, inside the array there should be an object with two keys
         * yValue
         * category
         * */
        chart_data: PropTypes.array
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let chart = am4core.create(this.props.chart_id, am4charts.XYChart);
        chart.paddingRight = 20;
        // ... chart code goes here ...
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.minZoomCount = 5;


// this makes the data to be grouped
        categoryAxis.groupData = true;
        categoryAxis.groupCount = 500;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.categoryX = "category";
        series.dataFields.valueY = "yValue";
        series.name = "Data #1";
        series.tooltipText = "{yValue}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.fillOpacity = 1;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = valueAxis;

        var scrollbarX = new am4core.Scrollbar();
        scrollbarX.marginBottom = 20;
        chart.scrollbarX = scrollbarX;

        var data = [];
        // var visits = 10;
        // for (var i = 1; i < 50000; i++) {
        //     visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        //     data.push({ category: i, yValue: visits });
        // }

        // var data = [];
        console.log("DATA TO SHOW IS")
        console.log(data)
        chart.data = data;

        this.chart = chart;
        // this.root = root;
        this.series = series;
        this.categoryAxis = categoryAxis;
        this.valueAxis = valueAxis;
    }

    componentDidUpdate(oldProps) {
        // if (oldProps.paddingRight !== this.props.paddingRight) {
        //     this.chart.paddingRight = this.props.paddingRight;
        // }

        if(this.props.chart_data){
            this.chart.data = this.props.chart_data
            // this.xAxis.data.setAll(this.props.chart_data)
            // this.series.data.setAll(this.props.chart_data)
        }

    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
                    <div id={this.props.chart_id} style={{ width: "100%", height: "500px" }}></div>
        )
    }
}

export default PointChartCustomAM4;
