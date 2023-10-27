// next
import Head from 'next/head';
import { Container, Typography } from '@mui/material';
// layouts
import ManagerLayout from 'src/layouts/manager/ManagerLayout';
// components
import { useSettingsContext } from 'src/components/settings';
import Block from 'src/components/settings/drawer/Block';
import _mock from 'src/_mock/_mock';
import OrganizationalChart from 'src/components/organizational-chart';
import { useEffect } from 'react';
import { useState } from 'react';
import { apiManager } from 'src/utils/api-manager';

const createData = (name, group, role, avatar) => ({
    name,
    group,
    role,
    avatar,
});

const SalesManOrganizationChart = () => {
    const { themeStretch } = useSettingsContext();
    const [data, setData] = useState({
        children:[]
    });
    const [searchObj, setSearchObj] = useState({
        page: 1,
        page_size: 10,
        s_dt: '',
        e_dt: '',
        search: '',
    })
    useEffect(() => {
        pageSetting();
    }, [])
    const pageSetting = () => {
        onChangePage({ ...searchObj, page: 1 });
    }
    const onChangePage = async (obj) => {
        setData(undefined)
        let data_ = await apiManager('users/organizational-chart', 'list', obj);
        if (data_) {
            if(!data_[0]?.children){
                data_[0].children = [];
            }
            setData(data_[0]);
        }
        setSearchObj(obj);
    }
    return (
        <>
            <Block sx={{ overflow: 'auto' }}>
                {data &&
                    <>
                        <OrganizationalChart data={data} variant="standard" lineHeight="40px" />
                    </>}
            </Block>
        </>
    );
}
SalesManOrganizationChart.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;

export default SalesManOrganizationChart;
