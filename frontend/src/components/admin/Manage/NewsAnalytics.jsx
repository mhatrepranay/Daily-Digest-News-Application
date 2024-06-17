import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    Label,
    YAxis,
    Cell,
} from "recharts";
import "./mange.css";
import Loader from "../../loader/loader";
import { styles } from "../../style/style";
import AdminSidebar from "../Sidebar/AdminSidebar";

const colors = [
    "green",
    "#00C49F",
    "pink",
    "#FF8042",
    "darkred",
    "yellow",
    "#6495ED", // Cornflower blue
    "#20B2AA", // Light sea green
    "#9370DB", // Medium purple
    "#4682B4", // Steel blue
    "#FFA500", // Orange
    "#808000",
];

const NewsAnalytics = ({ dashboard }) => {
    const [isLoading, setIsLoading] = useState(true);
    // const [analyticsData, setAnalyticsData] = useState([]);



    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.get("https://dailydigest-backend-1.onrender.com/analytics/article");


                const data = response.data?.users?.map((item) => ({
                    name: `${item.month} ${item.year}`,
                    articles: item.count,
                })) || [];

                // setAnalyticsData(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);
    const analyticsData = [
        { name: "May 2023", articles: 30 },
        { name: "Jun 2023", articles: 40 },
        { name: "Jul 2023", articles: 20 },
        { name: "Aug 2023", articles: 50 },
        { name: "Sep 2023", articles: 70 },
        { name: "Oct 2023", articles: 20 },
        { name: "Nov 2023", articles: 50 },
        { name: "Dec 2023", articles: 70 },
        { name: "Jan 2024", articles: 30 },
        { name: "Feb 2024", articles: 40 },
        { name: "Mar 2024", articles: 20 },
        { name: "Apr 2024", articles: 50 },
    ];

    const minValue = 0;
    const tickColor = dashboard ? "#000" : "#fff";
    const tickColor1 = dashboard ? "#000" : "#ffffff73";


    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="flex">
                    {
                        dashboard ? (
                            <div></div>
                        ) : (

                            <AdminSidebar />
                        )
                    }
                    <div className="hide1 flex-1 h-screen  overflow-auto p-3 ">
                        <div className="mt-[0px]">
                            <h1
                                style={{ fontSize: "25px" }}
                                className={`${styles.title} px-5   !text-start ${dashboard ? "ml-[25vh]" : "text-white"}`}
                            >
                                Articles Analytics
                            </h1>
                            {
                                dashboard ? (
                                    <div></div>

                                ) : (

                                    <p
                                        style={{ fontSize: "25px" }}
                                        className={`${styles.title} text-white px-5`}
                                    >
                                        Last 12 months analytics data
                                    </p>
                                )
                            }

                        </div>
                        <div
                            className={`${dashboard
                                ? "w-[85vh] h-[48%] mt-[-8vh] com-bg  rounded-lg"
                                : "w-[90%] h-[90%]"
                                } flex items-center justify-center  `}
                        >


                            <ResponsiveContainer width="90%" height="50%">
                                <BarChart width={150} height={300} data={analyticsData}>
                                    <XAxis dataKey="name" tick={{ fontSize: "14px", fill: tickColor }}>
                                        <Label offset={0} position={"insideBottom"} />
                                    </XAxis>
                                    <YAxis
                                        tick={{ fontSize: "14px", fill: tickColor }}
                                        domain={[minValue, "auto"]}
                                    />
                                    <Bar dataKey="articles" label={{ position: "top", fill: tickColor1 }}>
                                        {analyticsData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={colors[index % colors.length]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NewsAnalytics;
