import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Home from "./components/Home";
import AdminPannel from "./components/admin/AdminPannel";
import MyPackagers from "./components/MyPackagers";
import AdminShowUserProfile from './components/admin/AdminShowUserProfile';
import UnlockHistory from './components/UnlockHistory';
import {Flex} from "@chakra-ui/react";

function App() {
	const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
	const updateUserData = (userInfo) => {
	localStorage.setItem("user", JSON.stringify(userInfo));
	setUser(userInfo);
	}

	return (
		<BrowserRouter>
			<UserContext.Provider value={{
				user: user,
				setUserContext: updateUserData
			}}>
				<Flex className="App" direction={"column"} height={"100vh"} padding={8}>
					<Header title="My application"></Header>
					<Flex flexGrow={1} overflowY="auto" paddingBottom={"0"}>
						<Routes>
							<Route path="/" exact element={<Home />}></Route>
							<Route path="/login" exact element={<Login />}></Route>
							<Route path="/register" element={<Register />}></Route>
							<Route path="/admin" element={<AdminPannel />}></Route>
							<Route path="/profile" element={<Profile />}></Route>
							<Route path="/logout" element={<Logout />}></Route>
							<Route path="/my-packagers" element={<MyPackagers />}></Route>
							<Route path="/my-packagers/hostory" element={<UnlockHistory />}></Route>
							<Route path="/admin/userInfo" element={<AdminShowUserProfile />}></Route>
						</Routes>
					</Flex>
				</Flex>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
