import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LogSign.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const LogSign = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [username1, setUsername1] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('User');
    const [password1, setPassword1] = useState('');
    const [password, setPassword] = useState('');
    const [confpassword, setConfpassword] = useState('');
    const [isSignIn, setIsSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    useEffect(() => {
        const container = document.getElementById('container');
        if (isSignIn) {
            container.classList.remove('sign-up');
            container.classList.add('sign-in');
        } else {
            container.classList.remove('sign-in');
            container.classList.add('sign-up');
        }
    }, [isSignIn]);

    const toggle = () => {
        setIsSignIn(prevIsSignIn => !prevIsSignIn);
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            toast.error('Invalid email format');
            return;
        }
        // Validate password length and complexity
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }
        // Other validation checks...
        if (username.trim() === '' || email.trim() === '' || password.trim() === '' || confpassword.trim() === '') {
            toast.error('All fields are required');
            return;
        }
        if (password !== confpassword) {
            toast.error('Passwords do not match');
            return;
        }

        axios.post("https://dailydigest-backend-1.onrender.com/createUser1", { username, email, password, confpassword, role })
            .then(result => {
                console.log(result);
                setUsername('');
                setEmail('');

                setPassword('');
                setConfpassword('');
                toast.success("SignUp Successfully...!")
                navigate('/login');
            })
            .catch(err => {
                console.error('Signup error:', err.response.data.message);
            });
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        if (username1.trim() === '' || password1.trim() === '') {
            toast.error('Username or password is empty');
            return;
        }

        axios.post("https://dailydigest-backend-1.onrender.com/signIn", { username: username1, password: password1 })
            .then(response => {
                console.log('Sign-in response:', response.data);
                if (response.data.success) {
                    localStorage.setItem('token', response.data.token);
                    navigate('/');
                    toast.success("Logged in Successfully");
                } else {
                    console.error('Sign-in failed:', response.data.message);
                }
            })
            .catch(error => {
                toast.error('username or password is incorrect');
            });
    };

    const handleKeyPress = (e, handler) => {
        if (e.key === 'Enter') {
            handler(e);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfPasswordVisibility = () => {
        setShowConfPassword(!showConfPassword);
    };

    return (
        <div className="div-with-background">
            <div id="container" className="container sign-in">
                <div className="background-gradient">
                    <div className="row">
                        <div className="col align-items-center flex-col sign-up">
                            <div className="form-wrapper align-items-center">
                                <div className="form sign-up">

                                    <div className="input-group">
                                        <div className="icon text-light">
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                        <input type="text" placeholder="Username"
                                            value={username} onChange={(e) => setUsername(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, handleSignUp)} />
                                    </div>

                                    <div className="input-group">
                                        <div className="icon text-light">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </div>
                                        <input type="email" placeholder="Email"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, handleSignUp)} />
                                    </div>

                                    <div className="input-group password-input">
                                        <div className="icon text-light">
                                            <FontAwesomeIcon icon={faLock} />
                                        </div>
                                        <input type={showPassword ? 'text' : 'password'} placeholder="Password"
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, handleSignUp)} />
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEye : faEyeSlash}
                                            className="toggle-password"
                                            onClick={togglePasswordVisibility}
                                        />
                                    </div>

                                    <div className="input-group password-input">
                                        <div className="icon text-light">
                                            <FontAwesomeIcon icon={faLock} />
                                        </div>
                                        <input type={showConfPassword ? 'text' : 'password'} placeholder="Confirm password"
                                            value={confpassword} onChange={(e) => setConfpassword(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, handleSignUp)} />
                                        <FontAwesomeIcon
                                            icon={showConfPassword ? faEye : faEyeSlash}
                                            className="toggle-password"
                                            onClick={toggleConfPasswordVisibility}
                                        />
                                    </div>
                                    <button onClick={handleSignUp}>Sign up</button>
                                    <p>
                                        <span className='text-light'> Already have an account? </span>
                                        <b className="pointer text-light" onClick={toggle}> Sign in here </b>
                                    </p>
                                </div>
                            </div>
                            <div className="form-wrapper">
                                <div className="social-list align-items-center sign-up">
                                    <div className="align-items-center facebook-bg"></div>
                                    <div className="align-items-center google-bg"></div>
                                    <div className="align-items-center twitter-bg"></div>
                                    <div className="align-items-center insta-bg"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col align-items-center flex-col sign-in">
                            <div className="form-wrapper align-items-center">
                                <div className="form sign-in">
                                    <div className="input-group">
                                        <div className="icon text-light">
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                        <input type="text" placeholder="Username"
                                            value={username1} onChange={(e) => setUsername1(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, handleSignIn)} />
                                    </div>
                                    <div className="input-group password-input">
                                        <div className="icon text-light">
                                            <FontAwesomeIcon icon={faLock} />
                                        </div>
                                        <input type={showPassword ? 'text' : 'password'} placeholder="Password"
                                            value={password1} onChange={(e) => setPassword1(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, handleSignIn)} />
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEye : faEyeSlash}
                                            className="toggle-password"
                                            onClick={togglePasswordVisibility}
                                        />
                                    </div>
                                    <button onClick={handleSignIn}>Sign in</button>
                                    <p>
                                        <span className='text-light'> Don't have an account? </span>
                                        <b className="pointer text-light" onClick={toggle}> Sign up here </b>
                                    </p>
                                </div>
                            </div>
                            <div className="form-wrapper">
                                <div className="social-list align-items-center sign-in">
                                    <div className="align-items-center facebook-bg"></div>
                                    <div className="align-items-center google-bg"></div>
                                    <div className="align-items-center twitter-bg"></div>
                                    <div className="align-items-center insta-bg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row content-row">
                        <div className="col align-items-center flex-col">
                            <div className="text sign-in">
                                <h2>Welcome back</h2>
                                <p>"Welcome back! Log in to access your account."</p>
                            </div>
                            <div className="img sign-in">
                                <img src="./src/assets/undraw_browsing_online_re_umsa.svg" alt="welcome" />
                            </div>
                        </div>
                        <div className="col align-items-center flex-col">
                            <div className="img sign-up">
                                <img src="./src/assets/undraw_newspaper_re_syf5.svg" alt="welcome" />
                            </div>
                            <div className="text sign-up">
                                <h2>DailyDigest</h2>
                                <p className='rejtext'>
                                    "Welcome to DailyDigest! Stay informed with the latest news and in-depth articles.
                                    Join us to get personalized news updates delivered straight to your feed."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogSign;
