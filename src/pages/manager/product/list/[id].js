import { Avatar, Button, Card, Chip,  Divider, IconButton, Stack, InputLabel, MenuItem, Select, FormControl, } from "@mui/material";
import { useEffect, useState } from "react";
import ManagerTable from "src/views/manager/table/ManagerTable";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { Row } from "src/components/elements/styled-components";
import { toast } from "react-hot-toast";
import { useModal } from "src/components/dialog/ModalProvider";
import ManagerLayout from "src/layouts/manager/ManagerLayout";
import { apiManager } from "src/utils/api-manager";
import { useAuthContext } from "src/auth/useAuthContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { commarNumber } from "src/utils/function";
import { product_status_list } from "src/data/status-data";

const ProductList = () => {
    const { setModal } = useModal()
    const { user } = useAuthContext();
    const defaultColumns = [
        {
            id: 'id',
            label: 'No.',
            action: (row) => {
                return commarNumber(row['id'])
            }
        },
        {
            id: 'product_img',
            label: '상품이미지',
            action: (row) => {
                return <LazyLoadImage src={row['product_img']} style={{ height: '56px' }} />
            }
        },
        {
            id: 'category_name',
            label: '카테고리명',
            action: (row) => {
                return row['category_name'] ?? "---"
            }
        },
        {
            id: 'name',
            label: '상품명',
            action: (row) => {
                return row['name'] ?? "---"
            }
        },
        {
            id: 'price',
            label: '정책가',
            action: (row) => {
                return commarNumber(row['price'])
            }
        },
        {
            id: 'status',
            label: '상태',
            action: (row) => {
                return <Chip label={product_status_list[row?.status].title} variant="soft" color={product_status_list[row?.status].chip_color} />
            }
        },
        {
            id: 'created_at',
            label: '생성시간',
            action: (row) => {
                return row['created_at'] ?? "---"
            }
        },
        {
            id: 'updated_at',
            label: '최종수정시간',
            action: (row) => {
                return row['updated_at'] ?? "---"
            }
        },
        {
            id: 'edit',
            label: `${user?.level >= 40 ? '수정/삭제' : '판매가설정'}`,
            action: (row) => {
                return (
                    <>
                        <IconButton>
                            <Icon icon='material-symbols:edit-outline' onClick={() => {
                                router.push(`/manager/product/edit/${row?.id}`)
                            }} />
                        </IconButton>
                        {user?.level >= 40 &&
                            <>
                                <IconButton onClick={() => {
                                    setModal({
                                        func: () => { deleteItem(row?.id) },
                                        icon: 'material-symbols:delete-outline',
                                        title: '정말 삭제하시겠습니까?'
                                    })
                                }}>
                                    <Icon icon='material-symbols:delete-outline' />
                                </IconButton>
                            </>}
                    </>
                )
            }
        },
    ]
    const router = useRouter();
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState({});
    const [searchObj, setSearchObj] = useState({
        page: 1,
        page_size: 10,
        s_dt: '',
        e_dt: '',
        search: '',
    })
    const [dialogObj, setDialogObj] = useState({
        changePassword: false,
    })
    const [changePasswordObj, setChangePasswordObj] = useState({
        id: '',
        user_pw: ''
    })
    useEffect(() => {
        pageSetting();
    }, [router.query])
    const pageSetting = () => {
        let cols = defaultColumns;
        setColumns(cols)
        onChangePage({ ...searchObj, page: 1, });
    }
    const onChangePage = async (obj) => {
        setData({
            ...data,
            content: undefined
        })
        let params = {}
        if (!router.query?.id || router.query?.id == 'all') {
            params = { ...obj };
        } else {
            params = { ...obj, category_id: router.query?.id }
        }
        let data_ = await apiManager('products', 'list', params);
        if (data_) {
            setData(data_);
        }
        setSearchObj(obj);
    }
    const deleteItem = async (id) => {
        let data = await apiManager('products', 'delete', { id });
        if (data) {
            onChangePage(searchObj);
        }
    }
    return (
        <>

            <Stack spacing={3}>
                <Card>
                    <ManagerTable
                        data={data}
                        columns={columns}
                        searchObj={searchObj}
                        onChangePage={onChangePage}
                        add_button_text={user?.level >= 40 ? '상품 추가' : ''}
                    />
                </Card>
            </Stack>
        </>
    )
}
ProductList.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default ProductList
