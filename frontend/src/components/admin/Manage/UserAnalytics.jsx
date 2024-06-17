import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";
import "./mange.css";
import Loader from "../../loader/loader";
import { styles } from "../../style/style";
import AdminSidebar from "../Sidebar/AdminSidebar";

const UserAnalytics = ({ dashboard }) => {
    const [isLoading, setIsLoading] = useState(true);
    // const [analyticsData, setAnalyticsData] = useState([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.get("https://dailydigest-backend-1.onrender.com/analytics/users");


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
        { name: "May 2023", users: 30 },
        { name: "Jun 2023", users: 40 },
        { name: "Jul 2023", users: 20 },
        { name: "Aug 2023", users: 50 },
        { name: "Sep 2023", users: 70 },
        { name: "Oct 2023", users: 20 },
        { name: "Nov 2023", users: 50 },
        { name: "Dec 2023", users: 70 },
        { name: "Jan 2024", users: 30 },
        { name: "Feb 2024", users: 80 },
        { name: "Mar 2024", users: 40 },
        { name: "Apr 2024", users: 10 },
    ];
    const tickColor = dashboard ? "#000" : "#fff";

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
                    <div className="hide1   flex-1 h-screen overflow-auto p-3">



                        <div className="mt-[50px]">
                            <h1
                                style={{ fontSize: "25px" }}
                                className={`${styles.title} px-5  !text-start ${dashboard ? "ml-[25vh]" : "text-white "}`}
                            >
                                User Analytics
                            </h1>
                            {
                                dashboard ? (
                                    <div></div>

                                ) : (

                                    <p
                                        style={{ fontSize: "25px" }}
                                        className={`${styles.title}    px-5`}
                                    >
                                        Last 12 months analytics data
                                    </p>
                                )
                            }
                        </div>
                        <div
                            className={`${dashboard
                                ? "w-[85vh] h-[48%] mt-[-8vh] com-bg rounded-lg"
                                : "w-[90%] h-[90%]"
                                } flex items-center justify-center`}
                        >
                            <ResponsiveContainer width="90%" height="50%">
                                <AreaChart
                                    data={analyticsData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <XAxis dataKey="name" tick={{ fontSize: "14px", fill: tickColor }} />
                                    <YAxis tick={{ fontSize: "14px", fill: tickColor }} />
                                    <Tooltip
                                        className="text-black"
                                        contentStyle={{ backgroundColor: "#f5f5f5", borderColor: "#black", color: "#ff0000" }} // change text color here
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#black"
                                        fill="blue"
                                    />
                                    <Legend
                                        formatter={(value, entry, index) => <span className={`  ${dashboard ? "text-black" : "text-white"} font-bold text-xl`}>{"Users"}</span>}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAnalytics;
