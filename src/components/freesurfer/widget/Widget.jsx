import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import React from "react";

const Widget = ({ type }) => {
    let data;

    //temporary
    const amount = 100;
    const diff = 20;

    switch (type) {
        case "whole_brain_measurements_left":
            data = {
                title: "Whole Brain Measurements - Left hemisphere",
                isMoney: false,
                link: "See all users",
                icon: (
                        <PsychologyOutlinedIcon
                                className="icon"
                                style={{
                                    color: "crimson",
                                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                                }}
                        />
                ),
            };
            break;
        case "whole_brain_measurements_right":
            data = {
                title: "Whole Brain Measurements - Right hemisphere",
                isMoney: true,
                link: "View net earnings",
                icon: (
                        <PsychologyOutlinedIcon
                                className="icon"
                                style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
                        />
                ),
            };
            break;
        default:
            break;
    }

    return (
            <div className="widget">
                <div className="left">
                    <span className="title">{data.title}</span>
                    <span className="counter">
                        {data.isMoney && "$"} {amount}
                    </span>
                    <span className="link">{data.link}</span>
                </div>
                <div className="right">
                    <div className="percentage positive">
                        <KeyboardArrowUpIcon />
                        {diff} %
                    </div>
                    {data.icon}
                </div>
            </div>
    );
};

export default Widget;
