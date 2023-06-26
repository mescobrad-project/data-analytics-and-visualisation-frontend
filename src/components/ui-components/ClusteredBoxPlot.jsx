// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
import React from 'react';
import PropTypes from 'prop-types';

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";

class ClasteredBoxPlotChartCustom extends React.Component {
    static propTypes = {
        /** Prop "chart_id" provides the id of the chart and needs to be unique in each page */
        chart_id: PropTypes.string,
        chart_data: PropTypes.array
    }

    constructor(props) {
        super(props);
    }



    componentDidMount() {
        const root = am5.Root.new(this.props.chart_id);
        console.log("COMPONENT MOUNTED")
        root.setThemes([
            am5themes_Animated.new(root)
        ]);


        let chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    focusable: true,
                    panX: true,
                    panY: true,
                    wheelX: "panX",
                    wheelY: "zoomX"
                })
        );

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        let xAxis = chart.xAxes.push(
                am5xy.DateAxis.new(root, {
                    baseInterval: { timeUnit: "day", count: 1 },
                    renderer: am5xy.AxisRendererX.new(root, {}),
                    tooltip: am5.Tooltip.new(root, {})
                })
        );

        let yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    renderer: am5xy.AxisRendererY.new(root, {})
                })
        );

        let color = root.interfaceColors.get("background");

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        let series = chart.series.push(
                am5xy.CandlestickSeries.new(root, {
                    fill: color,
                    stroke: color,
                    name: "MDXI",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "q3",
                    openValueYField: "q1",
                    lowValueYField: "min",
                    highValueYField: "max",
                    valueXField: "date",
                    tooltip: am5.Tooltip.new(root, {
                        pointerOrientation: "horizontal",
                        labelText: "open: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nclose: {valueY},\nmedian: {q2}"
                    })
                })
        );

        // Add series
        // // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        // let series2 = chart.series.push(
        //         am5xy.CandlestickSeries.new(root, {
        //             fill: color,
        //             stroke: color,
        //             name: "MDXI",
        //             xAxis: xAxis,
        //             yAxis: yAxis,
        //             valueYField: "close2",
        //             openValueYField: "open2",
        //             lowValueYField: "low2",
        //             highValueYField: "high2",
        //             valueXField: "date",
        //             tooltip: am5.Tooltip.new(root, {
        //                 pointerOrientation: "horizontal",
        //                 labelText: "open: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nclose: {valueY},\nmediana: {mediana2}"
        //             })
        //         })
        // );

        // mediana series
        var medianaSeries = chart.series.push(
                am5xy.StepLineSeries.new(root, {
                    stroke: root.interfaceColors.get("background"),
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "q2",
                    valueXField: "date",
                    noRisers: true,
                    stepWidth: am5.percent(50),
                    locationX: 0.25
                })
        );

        // // mediana series
        // var medianaSeries2 = chart.series.push(
        //         am5xy.StepLineSeries.new(root, {
        //             stroke: root.interfaceColors.get("background"),
        //             xAxis: xAxis,
        //             yAxis: yAxis,
        //             valueYField: "mediana2",
        //             valueXField: "date",
        //             noRisers: true,
        //             stepWidth: am5.percent(50),
        //             locationX: 0.75
        //         })
        // );

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            xAxis: xAxis
        }));
        cursor.lineY.set("visible", false);

        // let data = [
        //     {
        //         date: "2019-08-01",
        //         q1: 34,
        //         max: 87,
        //         min: 19,
        //         q3: 55,
        //         q2:43,
        //         open2: 132.3+2,
        //         high2: 136.96+2,
        //         low2: 131.15+2,
        //         close2: 136.49+2
        //     // },
        //     // {
        //     //     date: "2019-08-02",
        //     //     open: 135.26,
        //     //     high: 135.95,
        //     //     low: 131.5,
        //     //     close: 131.85,
        //     //     open2: 135.26+2,
        //     //     high2: 135.95+2,
        //     //     low2: 131.5+2,
        //     //     close2: 131.85+2
        //     // },
        //     // {
        //     //     date: "2019-08-03",
        //     //     open: 129.9,
        //     //     high: 133.27,
        //     //     low: 128.3,
        //     //     close: 132.25,
        //     //     open2: 129.9 + 2,
        //     //     high2: 133.27 + 2,
        //     //     low2: 128.3 + 2,
        //     //     close2: 132.25 + 2
        //     // },
        //     // {
        //     //     date: "2019-08-04",
        //     //     open: 132.94,
        //     //     high: 136.24,
        //     //     low: 132.63,
        //     //     close: 135.03,
        //     //     open2: 132.94+2,
        //     //     high2: 136.24+2,
        //     //     low2: 132.63+2,
        //     //     close2: 135.03+2
        //     }
        // ];

        // addMediana();
        //
        // function addMediana() {
        //     for (var i = 0; i < data.length; i++) {
        //         var dataItem = data[i];
        //         dataItem.mediana = Number(dataItem.min) + (Number(dataItem.max) - Number(dataItem.min)) / 2;
        //         // dataItem.mediana2 = Number(dataItem.low2) + (Number(dataItem.high2) - Number(dataItem.low2)) / 2;
        //     }
        // }

        series.data.processor = am5.DataProcessor.new(root, {
            dateFields: ["date"],
            dateFormat: "yyyy-MM-dd"
        });

        series.data.setAll([]);
        // series2.data.setAll(data);
        medianaSeries.data.setAll([]);
        // medianaSeries2.data.setAll(data);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000, 100);
        medianaSeries.appear(1000, 100);
        // series2.appear(1000, 100);
        // medianaSeries2.appear(1000, 100);
        chart.appear(1000, 100);

        this.chart = chart;
        this.root = root;
        this.series = series;
        this.xAxis = xAxis;
    }

    componentDidUpdate(oldProps) {
        if(this.props.chart_data){
            this.xAxis.data.setAll(this.props.chart_data)
            this.series.data.setAll(this.props.chart_data)
        }
    }

    componentWillUnmount() {
        if (this.root) {
            this.root.dispose();
        }
    }

    render() {
        return (
                <div id={this.props.chart_id} style={{ width: "100%", height: "240px" }}></div>
        )
    }
}
export default ClasteredBoxPlotChartCustom;
