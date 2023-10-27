import { Avatar, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ManagerTable from "src/views/manager/table/ManagerTable";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { Row } from "src/components/elements/styled-components";
import { toast } from "react-hot-toast";
import { useModal } from "src/components/dialog/ModalProvider";
import ManagerLayout from "src/layouts/manager/ManagerLayout";
import { apiManager } from "src/utils/api-manager";
import { getUserLevelByNumber } from "src/utils/function";
import { useAuthContext } from "src/auth/useAuthContext";
const UserList = () => {
  const { setModal } = useModal()
  const { user } = useAuthContext();
  const defaultColumns = [
    {
      id: 'profile_img',
      label: '유저프로필',
      action: (row) => {
        return <Avatar src={row['profile_img'] ?? "---"} />
      }
    },
    {
      id: 'user_name',
      label: '유저아이디',
      action: (row) => {
        return row['user_name'] ?? "---"
      }
    },
    {
      id: 'parent_user_name',
      label: '상위유저아이디',
      action: (row) => {
        return row['parent_user_name'] ?? "---"
      }
    },
    {
      id: 'nickname',
      label: '닉네임',
      action: (row) => {
        return row['nickname'] ?? "---"
      }
    },
    {
      id: 'name',
      label: '이름',
      action: (row) => {
        return row['name'] ?? "---"
      }
    },
    {
      id: 'phone_num',
      label: '전화번호',
      action: (row) => {
        return row['phone_num'] ?? "---"
      }
    },
    {
      id: 'level',
      label: '유저레벨',
      action: (row) => {
        return getUserLevelByNumber(row['level'])
      }
    },
    {
      id: 'created_at',
      label: '가입일',
      action: (row) => {
        return row['created_at'] ?? "---"
      }
    },
    {
      id: 'last_login_time',
      label: '마지막로그인시간',
      action: (row) => {
        return row['last_login_time'] ?? "---"
      }
    },
    {
      id: 'status',
      label: '유저상태',
      action: (row, idx) => {

        return <Select
          size='small'
          value={row?.status}
          disabled={!(user?.level >= 40)}
          onChange={async (e) => {
            let result = await apiManager(`users/change-status`, 'update', {
              id: row?.id,
              status: e.target.value
            });
            if (result) {
              onChangePage(searchObj)
            }
          }}

        >
          <MenuItem value={'0'}>{'정상'}</MenuItem>
          <MenuItem value={'1'}>{'가입대기'}</MenuItem>
          <MenuItem value={'2'}>{'로그인금지'}</MenuItem>
        </Select>
      }
    },
    {
      id: 'edit_password',
      label: '비밀번호 변경',
      action: (row) => {
        if (user?.level < row?.level) {
          return "---"
        }
        return (
          <>
            <IconButton onClick={() => {
              setDialogObj({ ...dialogObj, changePassword: true })
              setChangePasswordObj({
                user_pw: '',
                id: row?.id
              })
            }}>
              <Icon icon='material-symbols:lock-outline' />
            </IconButton>
          </>
        )
      }
    },
    {
      id: 'edit',
      label: '수정/삭제',
      action: (row) => {
        return (
          <>
            <IconButton>
              <Icon icon='material-symbols:edit-outline' onClick={() => {
                router.push(`edit/${row?.id}`)
              }} />
            </IconButton>
            <IconButton onClick={() => {
              setModal({
                func: () => { deleteUser(row?.id) },
                icon: 'material-symbols:delete-outline',
                title: '정말 삭제하시겠습니까?'
              })
            }}>
              <Icon icon='material-symbols:delete-outline' />
            </IconButton>
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
    is_sales_man: true,
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
    onChangePage({ ...searchObj, page: 1 });
  }
  const onChangePage = async (obj) => {
    setData({
      ...data,
      content: undefined
    })
    let data_ = await apiManager('users', 'list', obj);
    if (data_) {
      setData(data_);
    }
    setSearchObj(obj);
  }
  const deleteUser = async (id) => {
    let data = await apiManager('users', 'delete', { id });
    if (data) {
      onChangePage(searchObj);
    }
  }
  const onChangeUserPassword = async () => {
    let result = await apiManager(`users/change-pw`, 'update', changePasswordObj);
    if (result) {
      setDialogObj({
        ...dialogObj,
        changePassword: false
      })
      setChangePasswordObj({
        id: '',
        user_pw: ''
      })
      toast.success("성공적으로 변경 되었습니다.");
    }
  }
  return (
    <>
      <Dialog
        open={dialogObj.changePassword}
      >
        <DialogTitle>{`비밀번호 변경`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            새 비밀번호를 입력 후 확인을 눌러주세요.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            value={changePasswordObj.user_pw}
            type="password"
            margin="dense"
            label="새 비밀번호"
            onChange={(e) => {
              setChangePasswordObj({
                ...changePasswordObj,
                user_pw: e.target.value
              })
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onChangeUserPassword}>
            변경
          </Button>
          <Button color="inherit" onClick={() => {
            setDialogObj({
              ...dialogObj,
              changePassword: false
            })
          }}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
      <Stack spacing={3}>
        <Card>
          <ManagerTable
            data={data}
            columns={columns}
            searchObj={searchObj}
            onChangePage={onChangePage}
            add_button_text={'영업자 추가'}
          />
        </Card>
      </Stack>
    </>
  )
}
UserList.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default UserList
