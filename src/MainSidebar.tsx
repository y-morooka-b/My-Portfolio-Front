import "./components_css/MainSidebar.css";
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';

export const MainSidebar = () => {
    let sidebar_data = [
        {
            title: "ホーム",
            icon: <HomeIcon />,
            link: "/"
        },
        {
            title: "カテゴリ管理",
            icon: <CategoryIcon />,
            link: "/category_management"
        }
    ];

    return (
        <div className='main-sidebar'>
            <ul className='main-sidebar-list'>
                {sidebar_data.map((value, key) => {
                    return (
                        <li
                            key={key}
                            className='row'
                            onClick={() => window.location.pathname = value.link}
                            id={window.location.pathname === value.link ? "active" : "home"}
                        >
                            <div id='icon'>{value.icon}</div>
                            <div id='title'>{value.title}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};


