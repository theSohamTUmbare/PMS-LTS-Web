import Header from "../components/Header";
// import Hero from "../components/Hero";
import Footer from "../components/Footer";
import NotificationContainer from "../utils/NotificationContainer";

interface Props {
    children: React.ReactNode;
}

const Layout = ({children} : Props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            {/* <Hero /> */}
            <div className="flex-1">
                {children}
            </div> 
            <Footer />
            <NotificationContainer/>
        </div>
    )
}

export default Layout;