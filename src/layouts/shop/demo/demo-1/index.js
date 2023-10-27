import { useSettingsContext } from "src/components/settings";
import Footer from "./footer";
import Header from "./header";

const Demo1 = (props) => {
    const { data: { children } } = props;
    const { themeMode } = useSettingsContext();
    return (
        <>
            <div style={{
                background: `${themeMode == 'dark' ? '#000' : '#fff'}`,
                color: `${themeMode == 'dark' ? '#fff' : '#000'}`,
            }}>
                <Header />
                {children}
                <Footer />
            </div>
        </>
    )
}
export default Demo1;