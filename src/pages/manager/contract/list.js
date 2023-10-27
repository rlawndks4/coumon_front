import { Avatar, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Stack, TextField } from "@mui/material";
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

const ContractList = () => {
  const { setModal } = useModal()
  const { user } = useAuthContext();
  const defaultColumns = [
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
      label: '가격',
      action: (row) => {
        return commarNumber(row['price'])
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
      label: `수정${user?.level >= 40 ? '/삭제' : ''}`,
      action: (row) => {
        return (
          <>
            <IconButton>
              <Icon icon='material-symbols:edit-outline' onClick={() => {
                router.push(`edit/${row?.id}`)
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
  }, [])
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
    let data_ = await apiManager('contracts', 'list', obj);
    if (data_) {
      setData(data_);
    }
    setSearchObj(obj);
  }
  const deleteItem = async (id) => {
    let data = await apiManager('contracts', 'delete', { id });
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
            add_button_text={'계약 추가'}
          />
        </Card>
      </Stack>
    </>
  )
}
ContractList.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default ContractList
