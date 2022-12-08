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
         * dictionary, x-axis name, y-axis name
         * */
        chart_data: PropTypes.array
    }

    constructor(props) {
        super(props);
        this.zoomOnUpdate = this.zoomOnUpdate.bind(this);
    }

    componentDidMount() {
        console.log("MOUNTED AGAIN")
        am4core.options.minPolylineStep = 5;
        let chart = am4core.create(this.props.chart_id, am4charts.XYChart);
        // chart.dateFormatter.dateFormat = "h-m-ss";
        // chart.dateFormatter.dateFormat = "yyyy-MM-dd";
        // chart.paddingRight = 20;
        // let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        // dateAxis.renderer.grid.template.location = 0;
        // dateAxis.minZoomCount = 300;
        // dateAxis.dateFormatter = new am4core.DateFormatter()
        // dateAxis.dateFormatter.dateFormat = "h:m:ss"
        // Options for grouping data based on date currently not used
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

        let valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
        let valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = "xValue";
        series.dataFields.valueY = "yValue";
        series.strokeOpacity = 0;
        // series.name = "Signal";

        let bullet = series.bullets.push(new am4charts.Bullet());
        let arrow = bullet.createChild(am4core.Circle);
        arrow.horizontalCenter = "middle";
        arrow.verticalCenter = "middle";
        arrow.strokeWidth = 0;
        arrow.fill = chart.colors.getIndex(0);
        // arrow.direction = "top";
        arrow.width = 8;
        arrow.height = 8;


        series.tooltipText = "X: {xValue} / Y: {yValue}";

        // series.tooltipText = "Test";
        // series.tooltip.pointerOrientation = "vertical";
        // series.tooltip.background.fillOpacity = 1;
        // series.fillOpacity = 0;
        // // Apply different colour to peaks show it is visible from all zoom level but due to scaling currently disabled
        // series.propertyFields.stroke = "color"
        // series.propertyFields.fill = "color"
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();

        // series.minBulletDistance = 1;
        //
        // // Initialise bullets
        // let bullet = series.bullets.push(new am4charts.Bullet());
        // bullet.hidden = true
        // bullet.propertyFields.hidden = "show_peak"
        //
        // let square = bullet.createChild(am4core.Rectangle);
        // square.width = 10;
        // square.height = 10;
        // square.fill = am4core.color("#ff0000");
        // square.horizontalCenter = "middle";
        // square.verticalCenter = "middle";
        //
        // chart.cursor = new am4charts.XYCursor();
        // chart.cursor.lineY.opacity = 0;
        //
        // let scrollbarX = new am4core.Scrollbar();
        // scrollbarX.marginBottom = 10;
        // chart.scrollbarX = scrollbarX;
        //
        // let scrollbarY = new am4core.Scrollbar();
        // scrollbarY.marginLeft = 10;
        // chart.scrollbarY = scrollbarY;
        chart.cursor = new am4charts.XYCursor();
        am4charts.ValueAxis.prototype.getSeriesDataItem = function(series, position) {
            var key = this.axisFieldName + this.axisLetter;
            var value = this.positionToValue(position);
            const dataItem = series.dataItems.getIndex(series.dataItems.findClosestIndex(value, function(x) {
                return x[key] ? x[key] : undefined;
            }, "any"));
            return dataItem;
        }



        let data = [];
        chart.data = data;



        // Bind variables used outside this initialisation to this
        this.chart = chart;
        // this.valueAxisX = valueAxisX;
        // this.valueAxisY = valueAxisY;
        this.series = series;

        // var selector = new am4plugins_rangeSelector.DateAxisRangeSelector();
        // selector.container = document.getElementById("selectordiv");
        // selector.position = "right";
        // selector.inputDateFormat = "yyyy-MM-dd H:m:ss";
        // // Remove unneeded buttons already existing
        // selector.periods = []
        //
        //
        // // Add new relevant buttons
        // // selector.periods.unshift(
        // //         { name: "50%", interval: { timeUnit: "day", count: 3 } }
        // // );
        //
        // console.log(selector.periods)
        // Trigger the initial zoom when new data is loaded

        chart.events.on("datavalidated",this.zoomOnUpdate)
    }

    // Function that shows only the first half of chart on load
    zoomOnUpdate() {
        // this.dateAxis.zoomToCategories("0",String(this.props.chart_data.length/2) )
        this.dateAxis.start = 0;
        this.dateAxis.end = 0.5;

    }

    componentDidUpdate(oldProps) {
        // if (oldProps.paddingRight !== this.props.paddingRight) {
        //     this.chart.paddingRight = this.props.paddingRight;
        // }

        if(this.props.chart_data !== this.chart.data){


            // let tempdata =  this.props.chart_data
            this.chart.data = this.props.chart_data

            // console.log("TESTRTEARAWR")
            // console.log(this.chart.data)
            // console.log("TESTRTEARAWR")
            // for (let it=0 ; this.chart.data.length ; it++){
            //     console.log(this.chart.data[it])
            //     if (!this.chart.data[it]){
            //         continue
            //     }
            //     if(it>1020 && it<1050){
            //         this.chart.data[it].color = this.chart.colors.getIndex(5);
            //     }else{
            //         this.chart.data[it].color = this.chart.colors.getIndex(0);
            //     }
            // }

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
                <div>
                    <div id={this.props.chart_id} style={{ width: "100%", height: "500px" }}></div>
                    {/*<div id="selectordiv"></div>*/}
                </div>
        )
    }

}
export default ScatterPlot;
