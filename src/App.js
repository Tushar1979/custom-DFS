import logo from './logo.svg';
import './App.css';
import NavBar from "./components/navbar/navbar"
import DataNavBar from "./components/datanavbar/datanavbar";
import Home from "./components/home/index"
// import AdDataTable from "./components/home/dataTable"
import ReportBog from "./components/reportBug";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
function App() {
  return (
    <div className="App">
        <Router>
            <div>
                <NavBar/>
                <DataNavBar />
                <Switch>
                    <Route path="/">
                        <Home />
                        {/*<AdDataTable/>*/}
                    </Route>
                    <Route path="/report-bug">
                        <ReportBog />
                    </Route>
                </Switch>
            </div>
        </Router>
    </div>
  );
}

export default App;
