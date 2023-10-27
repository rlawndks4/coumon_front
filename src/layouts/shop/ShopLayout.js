import { useSettingsContext } from "src/components/settings";
import Demo1 from "./demo/demo-1";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { apiShop } from "src/utils/api-shop";
import ScrollToTop from "src/components/scroll-to-top";
import { Fab } from "@mui/material";
import { Icon } from "@iconify/react";

const getDemo = (num, common) => {
    if (num == 1)
        return <Demo1 {...common} />

}

const ShopLayout = ({ children }) => {

    const router = useRouter();
    const { themeDnsData, themeShopSetting } = useSettingsContext();


    return (
        <>
            {(themeDnsData?.id > 0 && Object.keys(themeShopSetting).length > 0) &&
                <>

                    {getDemo(themeDnsData?.shop_demo_num, {
                        data: {
                            children
                        },
                        func: {
                            router
                        },
                    })}
                </>}
            <ScrollToTop className='mui-fixed'>
                <Fab size='small' aria-label='scroll back to top'>
                    <Icon icon='tabler:arrow-up' />
                </Fab>
            </ScrollToTop>
        </>
    )
}
export default ShopLayout;