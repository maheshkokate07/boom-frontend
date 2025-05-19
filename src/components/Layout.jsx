import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <div className="h-screen overflow-hidden">
            <Header />
            <div className="pt-[56px] h-[calc(100vh-56px)]">
                <main className="overflow-y-scroll hide-scrollbar">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
