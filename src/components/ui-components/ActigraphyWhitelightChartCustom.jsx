import React from 'react';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_rangeSelector from "@amcharts/amcharts4/plugins/rangeSelector";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// am4core.useTheme(am4themes_animated);
/**
 * Component returns an lollipop style am5chart
 * Intented to be used to show an array of data usually in linear order but can be used in different manners
 */
class ActigraphyWhitelightChartCustom extends React.Component {
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
        console.log("MOUNTED AGAIN")
        am4core.options.minPolylineStep = 5;
        let chart = am4core.create(this.props.chart_id, am4charts.XYChart);
        chart.dateFormatter.dateFormat = "h-m-ss";
        // chart.dateFormatter.dateFormat = "yyyy-MM-dd";
        chart.paddingRight = 20;
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.minZoomCount = 300;
        dateAxis.dateFormatter = new am4core.DateFormatter()
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


        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());


        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX  = "date";
        series.dataFields.valueY = "whitelight";
        series.name = "Whitelight";
        series.tooltipText = "{whitelight}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.fillOpacity = 1;
        series.fillOpacity = 0;
        // Apply different colour to peaks show it is visible from all zoom level but due to scaling currently disabled
        // series.propertyFields.stroke = "color"
        // series.propertyFields.fill = "color"

        series.minBulletDistance = 1;

        // let series2 = chart.series.push(new am4charts.LineSeries());
        // series2.dataFields.dateX  = "date";
        // series2.dataFields.valueY = "whitelight";
        // series2.name = "Signal";
        // series2.tooltipText = "{yValue}";
        // series2.tooltip.pointerOrientation = "vertical";
        // series2.tooltip.background.fillOpacity = 1;
        // series2.fillOpacity = 0;
        // // Apply different colour to peaks show it is visible from all zoom level but due to scaling currently disabled
        // // series.propertyFields.stroke = "color"
        // // series.propertyFields.fill = "color"
        //
        // series2.minBulletDistance = 1;

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

        let scrollbarX = new am4core.Scrollbar();
        scrollbarX.marginBottom = 10;
        chart.scrollbarX = scrollbarX;

        let scrollbarY = new am4core.Scrollbar();
        scrollbarY.marginLeft = 10;
        chart.scrollbarY = scrollbarY;

        let data = [];
        chart.data = data;

        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";

        // Bind variables used outside this initialisation to this
        this.chart = chart;
        this.dateAxis = dateAxis;
        this.series = series;

        // var selector = new am4plugins_rangeSelector.DateAxisRangeSelector();
        // selector.container = document.getElementById("selectordiv");
        // selector.axis = dateAxis;
        // selector.position = "right";
        // selector.inputDateFormat = "yyyy-MM-dd H:m:ss";
        // // Remove unneeded buttons already existing
        // selector.periods = []


        // Add new relevant buttons
        // selector.periods.unshift(
        //         { name: "50%", interval: { timeUnit: "day", count: 3 } }
        // );

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
            console.log("TESTRTEARAWR")
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
                <div>
                    <div id={this.props.chart_id} style={{ width: "100%", height: "500px" }}></div>
                    <div id="selectordiv"></div>
                </div>
        )
    }
}

export default ActigraphyWhitelightChartCustom;
