import React from 'react';
import PropTypes from 'prop-types';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

class LineChart extends React.Component {
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
        const root = am5.Root.new(this.props.chart_id);
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    panX: true,
                    panY: true,
                    wheelX: "panX",
                    wheelY: "zoomX",
                    pinchZoomX:true,
                    // layout: root.verticalLayout
                })
        );
        let data = [];
        chart.data = data;

        // Format numbers
        root.numberFormatter.set("numberFormat", "#a");
        // Create Y-axis
        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
                })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            maxDeviation: 0.2,
            baseInterval: {
                timeUnit: "millisecond",
                count: 1
            },
            renderer: am5xy.AxisRendererX.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
                })
        );
        // xAxis.data.setAll(data);
        xAxis.data.setAll([]);
        // Create series
        let series1 = chart.series.push(
                am5xy.LineSeries.new(root, {
                    name: "Series 1",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "signal",
                    valueXField: "date",
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "{valueY}"
                })})
        );
        series1.data.setAll([]);

        let series2 = chart.series.push(
                am5xy.LineSeries.new(root, {
                    name: "Series 2",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "upper",
                    valueXField: "date",
                    fill: am5.color("#00ff00"),
                    stroke: am5.color("#00ff00"),
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "{valueY}"
                    })})
        );
        series2.data.setAll([]);

        let series3 = chart.series.push(
                am5xy.LineSeries.new(root, {
                    name: "Series 3",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "lower",
                    valueXField: "date",
                    fill: am5.color(0xff0000),
                    stroke: am5.color(0xff0000),
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "{valueY}"
                    })})
        );
        series3.data.setAll([]);

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        // Add cursor
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "zoomX"
        }));
        cursor.lineY.set("visible", false);

        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal"
        }));

        this.chart = chart;
        this.root = root;
        this.series1 = series1;
        this.series2 = series2;
        this.series3 = series3;
        this.xAxis = xAxis;
    }

    componentDidUpdate(oldProps) {
        if(this.props.chart_data){
            this.xAxis.data.setAll(this.props.chart_data)
            this.series1.data.setAll(this.props.chart_data)
            this.series2.data.setAll(this.props.chart_data)
            this.series3.data.setAll(this.props.chart_data)
            // this.series2.data.setAll(this.props.chart_data['lower'])
        }

    }

    componentWillUnmount() {
        if (this.root) {
            this.root.dispose();
        }
    }

    render() {
        return (
                <div id={this.props.chart_id} style={{ width: "100%", height: "400px" }}></div>
        );
    }
}

export default LineChart;
