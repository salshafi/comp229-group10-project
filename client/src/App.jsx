import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Items from './pages/Items.jsx';
import ItemForm from './pages/ItemForm.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { useAuth } from './context/AuthContext.jsx';
export default function App(){const {user}=useAuth();return <Routes><Route path="/login" element={user?<Navigate to="/"/>:<Login/>}/><Route path="/register" element={user?<Navigate to="/"/>:<Register/>}/><Route element={<ProtectedRoute/>}><Route element={<Layout/>}><Route path="/" element={<Dashboard/>}/><Route path="/items" element={<Items/>}/><Route path="/items/new" element={<ItemForm/>}/><Route path="/items/:id" element={<ItemDetail/>}/><Route path="/items/:id/edit" element={<ItemForm/>}/></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>; }
