import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Users from './crudOperation/Users';
import CreateUser from './crudOperation/CreateUser';
import UpdateUser from './crudOperation/UpdateUser';
import LogSign from './components/LogSign';
import Home from './components/home/Home';
import Sidebar from './components/admin/Sidebar/AdminSidebar';
import Header from './components/home/Header';
import ArticleForm from './components/admin/CreateNews';
import UpdateArticleForm from './components/admin/UpdateArticleForm';
import Profile from './components/user/Profile';
import { Toaster } from 'react-hot-toast';
import UserSidebar from './components/user/UserSidebar';
import UserArticleList from './components/user/UserArticleList';
import ArticleDetail from './components/admin/ArticleDetails';
import AdminArticleList from './components/admin/AdminArticleList';
import AdminArticleDetails from './components/admin/AdminArtcleDetails';
import UserList from './components/admin/Manage/UserList';
import NewsAnalytics from './components/admin/Manage/NewsAnalytics';
import UserAnalytics from './components/admin/Manage/UserAnalytics';
import Admin from './components/admin/Admin/Admin';
import UserArticleDetails from './components/user/UserArticleDetails';
import ArticleList from './components/admin/ArtcleList';
import ContactUs from './components/contactUs/ContactUs';
import News from './components/News/News';

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/user" element={<Users />} />
          <Route path="/login" element={<LogSign />} />
          <Route path="/about" element={<Home />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/api-news" element={<News />} />
          <Route path="/create-news" element={<ArticleForm />} />
          <Route path="/articles" element={<AdminArticleList />} />
          <Route path="/user-articles" element={<UserArticleList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashbord-user" element={<UserSidebar />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/article-analytics" element={<NewsAnalytics />} />
          <Route path="/user-analytics" element={<UserAnalytics />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/update1/:id" element={<UpdateUser />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/admin-articles/:id" element={<AdminArticleDetails />} />
          <Route path="/user-articles/:id" element={<UserArticleDetails />} />
          <Route path="/update/:id" element={<UpdateArticleForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
