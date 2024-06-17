import React, { useEffect, useState } from 'react';
import AdminSidebar from '../Sidebar/AdminSidebar';
import NewsAnalytics from '../Manage/NewsAnalytics';
import UserAnalytics from '../Manage/UserAnalytics';
import UserList from '../Manage/UserList';
import "./admin1.css";
import { useNavigate } from 'react-router-dom';
import useLoggedInUser from '../../customhook/loginUserData';

function Admin() {
    const [recentActivities, setRecentActivities] = useState([]);
    const navigate = useNavigate();
    const user = useLoggedInUser();

    useEffect

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (!token) {

            navigate("/");
            return;
        }
        const fetchRecentActivities = () => {
            // Example: Fetch recent activities from API or local storage
            const activities = [
                { activity: "Logged in as admin", time: new Date().toISOString() },

                // Add other initial activities here as needed
            ];

            const lastArticleAddedTime = localStorage.getItem('lastArticleAddedTime');
            const lastUserRoleUpdate = localStorage.getItem('lastUserRoleUpdate');
            const lastArticleUpdate = localStorage.getItem('lastArticleUpdate');



            const addActivityIfRecent = (timeKey, description) => {
                if (timeKey) {
                    const currentTime = new Date();
                    const activityTime = new Date(Number(timeKey));
                    const timeDifference = currentTime - activityTime; // Difference in milliseconds

                    if (timeDifference <= 3 * 60 * 60 * 1000) { // 3 hours in milliseconds
                        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
                        const hours = Math.floor(minutesDifference / 60);
                        const minutes = minutesDifference % 60;

                        let timeAgo = '';
                        if (hours > 0) {
                            timeAgo += `${hours} hr${hours > 1 ? 's' : ''}`;
                        }
                        if (minutes > 0) {
                            timeAgo += ` ${minutes} min${minutes > 1 ? 's' : ''}`;
                        }
                        if (timeAgo === '') {
                            timeAgo = '1 min';
                        }
                        timeAgo += ' ago';

                        activities.push({ activity: `${description} (${timeAgo})`, time: activityTime.toISOString() });
                    }
                }
            };

            addActivityIfRecent(lastArticleAddedTime, 'Added new article');
            addActivityIfRecent(lastUserRoleUpdate, 'Updated user roles');
            addActivityIfRecent(lastArticleUpdate, 'Updated a Article');

            setRecentActivities(activities);
        };

        fetchRecentActivities();
    }, []);

    return (
        <div className="flex ">
            <AdminSidebar />
            <div className="flex-1   overflow-auto h-screen hide1 flex fade-in p-3">
                <div className="w-[55%]">
                    <div>
                        <NewsAnalytics dashboard={true} />
                    </div>
                    <div className="mt-[-58vh]">
                        <UserAnalytics dashboard={true} />
                    </div>
                </div>
                <div className="w-[50%] hide1 h-screen overflow-y-auto ml-[-10vh]">
                    <UserList dashboard={true} />
                    <div className="mt-6 p-4 w-[85vh] com-bg rounded-lg shadow-m ml-5">
                        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                        <ul>
                            {recentActivities.map((activity, index) => (
                                <li key={index} className="py-2">{activity.activity}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
