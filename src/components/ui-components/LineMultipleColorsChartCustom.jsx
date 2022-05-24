import React from 'react';
import PropTypes from 'prop-types';

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";

/**
 * Component returns a range area style am5chart
 * Intented to be used to show an array of paired data usually in linear order but can be used in different manners
 * Current uses: confidence interval
 */
class LineMultipleColorsChartCustom extends React.Component {
    static propTypes = {
        /** Prop "chart_id" provides the id of the chart and needs to be unique in each page */
        chart_id: PropTypes.string,
        /** Prop "chart_data" provides the data of the chart, inside the array there should be an object with two keys
         * yValue
         * category
         * */
        chart_data: PropTypes.array,
        highlighted_areas: PropTypes.array
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
                layout: root.verticalLayout,
                scrollbarX: am5.Scrollbar.new(root, { orientation: "horizontal" }),
                scrollbarY: am5.Scrollbar.new(root, { orientation: "vertical" }),
                pinchZoomX:true
            })
        );

        var colorSet = am5.ColorSet.new(root, {});
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
            categoryField: "category",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxPrecision: 0,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        // Create series
        let series = chart.series.push(am5xy.LineSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "yValue",
            categoryXField: "category",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}",
                // dy:-5
            })
        }));

        series.strokes.template.setAll({
            templateField: "strokeSettings",
            strokeWidth: 2
        });

        series.fills.template.setAll({
            visible: true,
            fillOpacity: 0.5,
            templateField: "fillSettings"
        });


        series.bullets.push(function() {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    templateField: "bulletSettings",
                    radius: 5
                })
            });
        });

        series.strokes.template.set("strokeWidth", 2);
        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

        xAxis.data.setAll([]);
        series.data.setAll([]);

        // // Add legend
        // let legend = chart.children.push(am5.Legend.new(root, {}));
        // legend.data.setAll(chart.series.values);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);

        this.chart = chart;
        this.root = root;
        this.series = series;
        this.xAxis = xAxis;
        this.colorSet= colorSet;
    }

    componentDidUpdate(oldProps) {
        if(this.props.chart_data){
            // Put correct color in data
            let temp_data = this.props.chart_data;


            if (this.props.highlighted_areas.length > 0) {
                let spindle_it = 0;
                let in_spindle_flag = false;

                for (let it = 0; it < temp_data.length; it++) {
                    // If we are at the start of a spindle enable the flag
                    // console.log("INT IS")
                    // console.log(this.props.highlighted_areas[spindle_it][0])
                    if (in_spindle_flag) {
                        console.log("in_spindle_flag is TRUE -----------------------------------------------------")
                        console.log(this.props.highlighted_areas[spindle_it][1])
                        console.log(it)
                        // If we are inside a spindle we chagne the color and if we are at the end we increase the iterator
                        temp_data[it]["strokeSettings"] = {stroke: this.colorSet.getIndex(spindle_it+1)}
                        temp_data[it]["fillSettings"] = {fill: this.colorSet.getIndex(spindle_it+1)}
                        temp_data[it]["bulletSettings"] = {fill: this.colorSet.getIndex(spindle_it+1)}
                        if (parseInt(this.props.highlighted_areas[spindle_it][1]) ===  it) {
                            //If here then this spindle is over so we increase the it
                            console.log("in_spindle_flag is becoming FALSE -----------------------------------------------------")
                            in_spindle_flag = false;
                            if(spindle_it< this.props.highlighted_areas.length -1){
                                spindle_it++;
                            }else{
                                const pass = null
                            }
                        }
                    }else{
                        console.log("this.props.highlighted_areas[spindle_it][0]")
                        console.log(it)
                        console.log(this.props.highlighted_areas[spindle_it][0])
                        if (parseInt(this.props.highlighted_areas[spindle_it][0]) ===  it) {
                            in_spindle_flag = true;
                        }
                        // If outside spindle we color using the normal colours
                        temp_data[it]["strokeSettings"] = {stroke: this.colorSet.getIndex(0)}
                        temp_data[it]["fillSettings"] = {fill: this.colorSet.getIndex(0)}
                        temp_data[it]["bulletSettings"] = {fill: this.colorSet.getIndex(0)}
                    }
                }
            }

            console.log(temp_data)
            this.xAxis.data.setAll(temp_data)
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

export default LineMultipleColorsChartCustom;
