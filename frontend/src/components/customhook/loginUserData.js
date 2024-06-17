// hook.js

import { useEffect, useState } from 'react';
import axios from 'axios';

const useLoggedInUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Handle error or redirect if user is not authenticated
                return;
            }

            try {
                const response = await axios.get('https://dailydigest-backend-1.onrender.com/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data); // Assuming response.data contains user details
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Handle error: show error message, redirect, etc.
            }
        };

        fetchUserData();
    }, []);

    return user;
};

export default useLoggedInUser;
