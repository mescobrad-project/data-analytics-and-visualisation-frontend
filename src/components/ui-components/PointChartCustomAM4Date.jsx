import React from 'react';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// am4core.useTheme(am4themes_animated);
/**
 * Component returns an lollipop style am5chart
 * Intented to be used to show an array of data usually in linear order but can be used in different manners
 */
class PointChartCustomAM4Date extends React.Component {
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
        this.zoomOnUpdate = this.zoomOnUpdate.bind(this);
    }

    componentDidMount() {
        am4core.options.minPolylineStep = 5;
        let chart = am4core.create(this.props.chart_id, am4charts.XYChart);
        chart.dateFormatter.dateFormat = "mm:ss";
        chart.paddingRight = 20;
        // ... chart code goes here ...
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.minZoomCount = 5;
        // dateAxis.groupData = true;
        // dateAxis.groupCount = 500;


        // dateAxis.dateFormats = "mm:ss SSS";
        // categoryAxis.dataFields.category = "category";
        // // categoryAxis.renderer.grid.template.location = 0;
        // categoryAxis.minZoomCount = 5;
        // categoryAxis.keepSelection=true
        // categoryAxis.start =0;
        // categoryAxis.end =0.5;
        // categoryAxis.keepSelection = true;

// this makes the data to be grouped
//         categoryAxis.groupData = true;
//         categoryAxis.groupCount = 500;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // valueAxis.propertyFields.
        // valueAxis.keepSelection =true;
        // valueAxis.start =0;
        // valueAxis.end =0.5;

        // var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX  = "date";
        series.dataFields.valueY = "yValue";
        series.name = "Signal";
        series.tooltipText = "{yValue}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.fillOpacity = 1;
        series.fillOpacity = 1;
        // series.propertyFields.stroke = "color"
        // series.propertyFields.fill = "color"

        series.minBulletDistance = 1;

        var bullet = series.bullets.push(new am4charts.Bullet());
        bullet.hidden = true
        // bullet.show = true
        bullet.propertyFields.hidden = "show_peak"

        var square = bullet.createChild(am4core.Rectangle);
        square.width = 10;
        square.height = 10;
        square.fill = am4core.color("#ff0000");
        square.horizontalCenter = "middle";
        square.verticalCenter = "middle";
        // if(chart.yAxes.indexOf(valueAxis2) != 0){
        //     valueAxis2.syncWithAxis = chart.yAxes.getIndex(0);
        // }


        // valueAxis2.renderer.opposite = true;
        //
        // var series2 = chart.series.push(new am4charts.LineSeries());
        // series2.dataFields.categoryX = "category";
        // series2.dataFields.valueY = "yValue2";
        // series2.name = "Peaks";
        // series2.tooltipText = "{yValue2}";
        // series2.tooltip.pointerOrientation = "vertical";
        // series2.tooltip.background.fillOpacity = 1;
        // series2.fillOpacity = 1;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineY.opacity = 0;
        // chart.cursor.xAxis = valueAxis;

        var scrollbarX = new am4core.Scrollbar();
        scrollbarX.marginBottom = 10;
        chart.scrollbarX = scrollbarX;

        var scrollbarY = new am4core.Scrollbar();
        scrollbarY.marginLeft = 10;
        chart.scrollbarY = scrollbarY;

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

        // categoryAxis.start = 0.8;
        // categoryAxis.end = 1;




        this.chart = chart;
        // this.categoryAxis = categoryAxis;
        // this.root = root;
        this.series = series;

        chart.events.on("datavalidated",this.zoomOnUpdate)

        // chart.events.on("ready", function () {
        //     valueAxis.start = 0.8;
        //     valueAxis.end = 1;
        //     valueAxis.keepSelection = true;
        // });

    }

     zoomOnUpdate() {
        this.categoryAxis.zoomToCategories("0",String(this.props.chart_data.length/2) )
    }

    componentDidUpdate(oldProps) {
        // if (oldProps.paddingRight !== this.props.paddingRight) {
        //     this.chart.paddingRight = this.props.paddingRight;
        // }

        if(this.props.chart_data){
            this.chart.data = this.props.chart_data

            // this.categoryAxis.zoomToCategories("1", "50")
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

export default PointChartCustomAM4Date;
