import "./components_css/App.css";
import Home from "./components/Home";
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
                        default:
                            return <Home />;
                    }
                })()}
            </div>
        </div>
    );
}

export default App;
