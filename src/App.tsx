import "./components_css/App.css";
import Home from "./components/Home";
import CategoryManagement from "./components/CategoryManagement";
import RevenueAndExpenseManagement from "./components/RevenueAndExpenseManagement";
import {MainSidebar} from "./MainSidebar";

function App() {
    return (
        <div id="App">
            <MainSidebar />

            <div id="main-working-space">
                {(() => {
                    console.log(window.location.pathname);
                    switch (window.location.pathname) {
                        case "/":
                            return <Home />;
                        case "/category_management" :
                            return <CategoryManagement />;
                        case "/revenue_and_expense_management" :
                            return <RevenueAndExpenseManagement />;
                        default:
                            return <Home />;
                    }
                })()}
            </div>
        </div>
    );
}

export default App;
