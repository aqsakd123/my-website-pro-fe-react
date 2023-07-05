import './App.css';
import { Routes, Route } from "react-router-dom";
import {AuthProvider} from "./pages/auth/auth-context";
import TopBar from "./pages/layout/top-bar";
import Dashboard from "./pages/dashboard";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/sign-up";
import {LayoutProvider} from "./components/layout-context";
import AxiosProvider from "./pages/auth/axios-context";
import ToDoList from "./pages/to-do-list";

function App() {
  return (
    <div className="app" >
      <LayoutProvider>
        <AuthProvider>
          <AxiosProvider>
            <TopBar />
            <div className={'body-container'}>
              <Routes>
                <Route path={"/"} element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/technical" >
                  <Route path={"/technical/study"} element={<Dashboard />} />
                  <Route path={"/technical/bookmark"} element={<Dashboard />} />
                  <Route path={"/technical/cheat"} element={<Dashboard />} />
                </Route>
                <Route path="/to-do" element={<ToDoList />} />
                {/*<Route path="*" element={<Page404 />} />*/}
              </Routes>
            </div>
          </AxiosProvider>
        </AuthProvider>
      </LayoutProvider>
    </div>
  );
}

export default App;
