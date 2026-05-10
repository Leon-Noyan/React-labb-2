import { NavLink, Outlet } from 'react-router-dom'

function RootLayout() {
    return (
        <div className="root-layout">
            <header className="navbar">
                <div className="logo">🌍 Memory Travels</div>
                <nav className="navbar-links">
                    <NavLink to="/"> Home</NavLink>
                    <NavLink to="/Journal">My Journal</NavLink>
                    <NavLink to="/Explore">Explore</NavLink>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default RootLayout
