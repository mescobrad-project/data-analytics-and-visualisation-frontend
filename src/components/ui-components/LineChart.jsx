import React from 'react';
import PropTypes from 'prop-types';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import HistogramChartCustom from "./HistogramChartCustom";

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
                    panY: false,
                    layout: root.verticalLayout
                })
        );
        // Format numbers
        root.numberFormatter.set("numberFormat", "#a");
        // Create Y-axis
        let yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    renderer: am5xy.AxisRendererY.new(root, {})
                })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
                am5xy.CategoryAxis.new(root, {
                    renderer: am5xy.AxisRendererX.new(root, {}),
                    categoryField: "category"
                })
        );
        // xAxis.data.setAll(data);
        xAxis.data.setAll([]);
        // Create series
        let series1 = chart.series.push(
                am5xy.ColumnSeries.new(root, {
                    name: "Series",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "value1",
                    categoryXField: "category",
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "{valueY}"
                })})
        );
        // series1.data.setAll(data);
        series1.data.setAll([]);
        xAxis.data.setAll([]);
        let series2 = chart.series.push(
                am5xy.ColumnSeries.new(root, {
                    name: "Series",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "value2",
                    categoryXField: "category",
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "{valueY}"
                    })})
        );

        series2.data.setAll([]);
        // series2.data.setAll(data);
        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        // Add cursor
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "zoomX"
        }));
        cursor.lineY.set("visible", false);

        this.chart = chart;
        this.root = root;
        // this.series = series;
        // this.xAxis = xAxis;
    }

    componentDidUpdate(oldProps) {
        if(this.props.chart_data){
            this.xAxis.data.setAll(this.props.chart_data)
            this.series1.data.setAll(this.props.chart_data['upper'])
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
