import React from 'react';
import PropTypes from 'prop-types';

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";

/**
 * Component returns an lollipop style am5chart
 * Intented to be used to show an array of data usually in linear order but can be used in different manners
 */
class PointChartMultipleCustom extends React.Component {
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
        console.log("COMPONENT MOUNTED")
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                scrollbarX: am5.Scrollbar.new(root, { orientation: "horizontal" }),
                scrollbarY: am5.Scrollbar.new(root, { orientation: "vertical" }),
                pinchZoomX:true
            })
        );
        // Format numbers
        root.numberFormatter.set("numberFormat", "#a");
// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        let xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 15
        });

        xRenderer.labels.template.setAll({
            rotation: -90,
            centerY: am5.p50,
            centerX: 0
        });

        xRenderer.grid.template.setAll({
            location: 0.5,
            strokeDasharray: [1, 3]
        });

        let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0.3,
            categoryField: "category",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.3,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));


        function createAxisAndSeries(startValue, opposite) {
            var yRenderer = am5xy.AxisRendererY.new(root, {
                opposite: opposite
            });


            if (this.chart.yAxes.indexOf(yAxis) > 0) {
                yAxis.set("syncWithAxis", this.chart.yAxes.getIndex(0));
            }

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            var series = this.chart.series.push(
                    am5xy.LineSeries.new(root, {
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: "value",
                        valueXField: "date",
                        tooltip: am5.Tooltip.new(root, {
                            pointerOrientation: "horizontal",
                            labelText: "{valueY}"
                        })
                    })
            );

            //series.fills.template.setAll({ fillOpacity: 0.2, visible: true });
            series.strokes.template.setAll({ strokeWidth: 1 });

            yRenderer.grid.template.set("strokeOpacity", 0.05);
            yRenderer.labels.template.set("fill", series.get("fill"));
            yRenderer.setAll({
                stroke: series.get("fill"),
                strokeOpacity: 1,
                opacity: 1
            });

            series.data.setAll(generateChartData(startValue));
        }


        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

        xAxis.data.setAll([]);
        series.data.setAll([]);

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
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
                    <div id={this.props.chart_id} style={{ width: "100%", height: "500px" }}></div>
        )
    }
}

export default PointChartMultipleCustom;
