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
                    scrollbarX: am5.Scrollbar.new(root, {orientation: "horizontal"}),
                    scrollbarY: am5.Scrollbar.new(root, {orientation: "vertical"}),
                    pinchZoomX: true
                })
        );
        // Format numbers
        root.numberFormatter.set("numberFormat", "#a");

        var colorSet = am5.ColorSet.new(root, {});
// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        let xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 15
        });

        xRenderer.labels.template.setAll({
            rotation: -90,
            centerY: am5.p50,
            centerX: 0,
            oversizedBehavior: "wrap"
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
            // maxPrecisionmaxPrecision: 0,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));
        // yAxis.min = -100;
        // yAxis.max = 100;

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


        series.bullets.push(function () {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    templateField: "bulletSettings",
                    radius: 1.5
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
        this.colorSet = colorSet;
    }


    async dataSetup(ourxAxis, ourSeries ,pointerFunctionDataSetup, prop_data, pointerColorset, temp_data = [], starting_point_it = 0, spindle_it_initial = 0, spindle_condition_initial = false) {
        //Spindle it initial saves and gets the previous reached spindle
        //Spindle condition initial saves whether we have entered
        console.log("STARTING FUNCTION")
        console.log("prop_data")
        console.log(prop_data)
        console.log("pointerColorset")
        console.log(pointerColorset)
        console.log("STARTING FUNCTION 2")

        let spindle_it = spindle_it_initial;
        let in_spindle_flag = spindle_condition_initial;
        let temp_data_to_return = temp_data
        for (let it = starting_point_it; it < prop_data.chart_data.length; it++) {
            // If we are at the start of a spindle enable the flag
            // console.log("IN FOR LOOP")
            // console.log(it)
            // console.log(this.props.highlighted_areas[spindle_it][0])

            let temp_data_to_append = {}
            if (in_spindle_flag) {
                // console.log("in_spindle_flag is TRUE -----------------------------------------------------")
                // console.log(this.props.highlighted_areas[spindle_it][1])
                // console.log(it)
                // If we are inside a spindle we chagne the color and if we are at the end we increase the iterator
                temp_data_to_append["category"] = it
                temp_data_to_append["yValue"] = prop_data.chart_data[it]
                temp_data_to_append["strokeSettings"] = {stroke: pointerColorset.getIndex(spindle_it + 1)}
                temp_data_to_append["fillSettings"] = {fill: pointerColorset.getIndex(spindle_it + 1)}
                temp_data_to_append["bulletSettings"] = {fill: pointerColorset.getIndex(spindle_it + 1)}

                if (parseInt(prop_data.highlighted_areas[spindle_it][1]) === it) {
                    //If here then this spindle is over so we increase the it
                    console.log("in_spindle_flag is becoming FALSE -----------------------------------------------------")
                    in_spindle_flag = false;
                    if (spindle_it < prop_data.highlighted_areas.length - 1) {
                        spindle_it++;
                    } else {
                        // if here we have no more spindles to detect
                        const pass = null
                    }
                }
            } else {
                // console.log("this.props.highlighted_areas[spindle_it][0]")
                // console.log(it)
                // console.log(this.props.highlighted_areas[spindle_it][0])

                //We enable the spindle flag  when we reach a spindle
                // NOTE This may do it one entry later and might need chagne but havent checked yet
                if (prop_data.highlighted_areas.length > 0 && parseInt(prop_data.highlighted_areas[spindle_it][0]) === it) {
                    in_spindle_flag = true;
                }
                // If outside spindle we color using the normal colours
                temp_data_to_append["category"] = it
                temp_data_to_append["yValue"] = prop_data.chart_data[it]
                temp_data_to_append["strokeSettings"] = {stroke: pointerColorset.getIndex(0)}
                temp_data_to_append["fillSettings"] = {fill: pointerColorset.getIndex(0)}
                temp_data_to_append["bulletSettings"] = {fill: pointerColorset.getIndex(0)}
            }
            // Add the constructed data to the temp array that will be returned
            temp_data_to_return.push(temp_data_to_append)

            // If this for loop has gone for over 1000 iteration stop and restart from new position to avoid maxing call stack size
            if (it >= starting_point_it + 1000) {
                let data_to_push = []
                for(let array_it =it-1000 ; array_it < it; array_it++){
                    data_to_push.push(temp_data[array_it])
                }
                // console.log("temp_data")
                // console.log(temp_data)
                // console.log(temp_data.length)
                console.log("data_to_push")
                console.log(data_to_push)
                // console.log("it")
                // console.log(it)
                // console.log(it-1000)
                ourxAxis.data.pushAll(data_to_push).then(async ()=> {
                            ourSeries.data.pushAll(data_to_push).then(async () => {
                                            return await pointerFunctionDataSetup(ourxAxis, ourSeries, pointerFunctionDataSetup, prop_data, pointerColorset, temp_data_to_return, it, spindle_it, in_spindle_flag)
                                    }
                            )



                        }
                )

                // return await pointerFunctionDataSetup(ourxAxis, ourSeries, pointerFunctionDataSetup, prop_data, pointerColorset, temp_data_to_return, it, spindle_it, in_spindle_flag)

                // let promise = new Promise(function(resolve, reject) {
                //     console.log("CALLING")
                //     console.log(it)
                //     console.log(prop_data)
                //     console.log(temp_data_to_return)
                //     // console.log(temp_data_to_return)
                //     // console.log(in_spindle_flag)
                //     // console.log(spindle_it)
                //     setTimeout(pointerFunctionDataSetup, 0,resolve, pointerFunctionDataSetup, prop_data, pointerColorset, temp_data_to_return, it, spindle_it, in_spindle_flag);
                // }).then(function() {
                //     console.log("RETURNING")
                //     console.log(promise)
                //     return promise
                // });
                // console.log(" BEYOND CALLING")


                // await pause(1000);
                break;
                // // setTimeout(this.dataSetup.bind(temp_data=temp_data_to_return, starting_point_it=it, spindle_it_initial=spindle_it,spindle_condition_initial=in_spindle_flag), 0);
                // console.log("RETURNING")
                // console.log(promise)
                // return promise
            }
        }
        // return {
        //     "constructed_data" : temp_data_to_return,
        //     "starting_point_it" : -1
        // };

        console.log("WOOOW LEAVING ALREADY")
        console.log(temp_data_to_return)
        return temp_data_to_return
        // resolve("test");
    }

    componentDidUpdate(oldProps) {
        if (this.props.chart_data) {
            // Put correct color in data
            // let temp_data = this.props.chart_data;
            let temp_data = [];

            // if (this.props.highlighted_areas.length > 0) {
            // let spindle_it = 0;
            // let in_spindle_flag = false;
            // for (let it = 0; it < this.props.chart_data.length; it++) {
            //     // If we are at the start of a spindle enable the flag
            //     // console.log("INT IS")
            //     // console.log(this.props.highlighted_areas[spindle_it][0])
            //     if (it > 2000) {
            //         break;
            //     }
            //     let is_thousand = !(it % 1000);
            //     if (is_thousand)
            //         setTimeout(start, 0);
            //
            //     let temp_data_to_append = {}
            //     if (in_spindle_flag) {
            //         // console.log("in_spindle_flag is TRUE -----------------------------------------------------")
            //         // console.log(this.props.highlighted_areas[spindle_it][1])
            //         // console.log(it)
            //         // If we are inside a spindle we chagne the color and if we are at the end we increase the iterator
            //         temp_data_to_append["category"] = it
            //         temp_data_to_append["yValue"] = this.props.chart_data[it]
            //         temp_data_to_append["strokeSettings"] = {stroke: this.colorSet.getIndex(spindle_it + 1)}
            //         temp_data_to_append["fillSettings"] = {fill: this.colorSet.getIndex(spindle_it + 1)}
            //         temp_data_to_append["bulletSettings"] = {fill: this.colorSet.getIndex(spindle_it + 1)}
            //
            //         if (parseInt(this.props.highlighted_areas[spindle_it][1]) === it) {
            //             //If here then this spindle is over so we increase the it
            //             console.log("in_spindle_flag is becoming FALSE -----------------------------------------------------")
            //             in_spindle_flag = false;
            //             if (spindle_it < this.props.highlighted_areas.length - 1) {
            //                 spindle_it++;
            //             } else {
            //                 const pass = null
            //             }
            //         }
            //     } else {
            //         // console.log("this.props.highlighted_areas[spindle_it][0]")
            //         // console.log(it)
            //         // console.log(this.props.highlighted_areas[spindle_it][0])
            //
            //         //We enable the spindle flag  when we reach a spindle
            //         // NOTE This may do it one entry later and might need chagne but havent checked yet
            //         if (this.props.highlighted_areas.length > 0 && parseInt(this.props.highlighted_areas[spindle_it][0]) === it) {
            //             in_spindle_flag = true;
            //         }
            //         // If outside spindle we color using the normal colours
            //         temp_data_to_append["category"] = it
            //         temp_data_to_append["yValue"] = this.props.chart_data[it]
            //         temp_data_to_append["strokeSettings"] = {stroke: this.colorSet.getIndex(0)}
            //         temp_data_to_append["fillSettings"] = {fill: this.colorSet.getIndex(0)}
            //         temp_data_to_append["bulletSettings"] = {fill: this.colorSet.getIndex(0)}
            //     }
            //     // There are always data to append no matter what so its done in the end of the for loop
            //     temp_data.push(temp_data_to_append)
            // }
            // }

            let pointerFunctionDataSetup = this.dataSetup
            // let pointerPropsPass = JSON.parse(JSON.stringify(this.props))
            let pointerPropsPass = this.props
            let pointerColorsetPass = this.colorSet

            // let pointerProps = this.props


            this.dataSetup(this.xAxis, this.series, pointerFunctionDataSetup, pointerPropsPass, pointerColorsetPass).then(result => {
                console.log("result")
                console.log(result)
                temp_data = result
                console.log("temp_data")
                console.log(temp_data)
                if (!temp_data) {
                    temp_data = []
                }
                // this.xAxis.data.setAll(temp_data)
                // this.series.data.setAll(temp_data)

                // this.chart.events.on("ready", function (ev) {
                //     this.xAxis.min = this.xAxis.minZoomed;
                //     this.xAxis.max = this.xAxis.maxZoomed;
                // });

            }
            )


            // let promise = new Promise(function(resolve, reject) {
            //     console.log("INITIAL CALLING")
            //     console.log(pointerPropsPass)
            //     console.log(pointerColorsetPass)
            //     // console.log(it)
            //     // console.log(temp_data_to_return)
            //     // console.log(in_spindle_flag)
            //     // console.log(spindle_it)
            //     // var that = this;
            //     setTimeout(pointerFunctionDataSetup, 0,pointerFunctionDataSetup , pointerPropsPass, pointerColorsetPass );
            //     console.log("INITIAL CALLING ENDING")
            //     // setTimeout(pointerFunctionDataSetup, 0);
            // }).then(function() {
            //     console.log("RETURNING FINAL")
            //     // console.log(promise)
            //
            //     temp_data = promise
            //     if(!temp_data){
            //         temp_data = []
            //     }
            //
            //     console.log("FINAL - temp_data - FINAl")
            //     console.log(temp_data)
            //     this.xAxis.data.setAll(temp_data)
            //     this.series.data.setAll(temp_data)
            //
            //     this.chart.events.on("ready", function (ev) {
            //         this.xAxis.min = this.xAxis.minZoomed;
            //         this.xAxis.max = this.xAxis.maxZoomed;
            //     });
            // });

            // temp_data = this.dataSetup()
            // if(!temp_data){
            //     temp_data = []
            // }
            //
            // console.log("temp_data")
            // console.log(temp_data)
            // this.xAxis.data.setAll(temp_data)
            // this.series.data.setAll(temp_data)
            //
            // this.chart.events.on("ready", function (ev) {
            //     this.xAxis.min = this.xAxis.minZoomed;
            //     this.xAxis.max = this.xAxis.maxZoomed;
            // });
        }
    }


    componentWillUnmount() {
        if (this.root) {
            this.root.dispose();
        }
    }

    render() {
        return (
                <div id={this.props.chart_id} style={{width: "100%", height: "500px"}}></div>
        )
    }
}

export default LineMultipleColorsChartCustom;
