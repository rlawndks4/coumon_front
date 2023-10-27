
import { Button, Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { themeObj } from "src/components/elements/styled-components";
import { useSettingsContext } from "src/components/settings";
import { Upload } from "src/components/upload";
import ManagerLayout from "src/layouts/manager/ManagerLayout";
import { base64toFile, getAllIdsWithParents } from "src/utils/function";
import styled from "styled-components";
import { react_quill_data } from "src/data/manager-data";
import { axiosIns } from "src/utils/axios";
import { toast } from "react-hot-toast";
import { useModal } from "src/components/dialog/ModalProvider";
import dynamic from "next/dynamic";
import { apiManager } from "src/utils/api-manager";
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const CustomerEdit = () => {
  const { setModal } = useModal()
  const { themeMode } = useSettingsContext();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    profile_file: undefined,
    user_name: '',
    phone_num: '',
    nickname: '',
    user_pw: '',
    note: '',
    name: '',
  })

  useEffect(() => {
    settingPage();
  }, [])
  const settingPage = async () => {
    if (router.query?.edit_category == 'edit') {
      let data = await apiManager('users', 'get', {
        id: router.query.id
      })
      setItem(data);
    }
    setLoading(false);
  }
  const onSave = async () => {
    let result = undefined
    if (item?.id) {//수정
      result = await apiManager('users', 'update', item);
    } else {//추가
      result = await apiManager('users', 'create', item);
    }
    if (result) {
      toast.success("성공적으로 저장 되었습니다.");
      router.push('/manager/user');
    }
  }
  return (
    <>
      {!loading &&
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      프로필사진
                    </Typography>
                    <Upload file={item.profile_file || item.profile_img} onDrop={(acceptedFiles) => {
                      const newFile = acceptedFiles[0];
                      if (newFile) {
                        setItem(
                          {
                            ...item,
                            ['profile_file']: Object.assign(newFile, {
                              preview: URL.createObjectURL(newFile),
                            })
                          }
                        );
                      }
                    }} onDelete={() => {
                      setItem(
                        {
                          ...item,
                          ['profile_img']: '',
                          ['profile_file']: undefined,
                        }
                      )
                    }}
                    />
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Stack spacing={3}>
                  <TextField
                    label='아이디'
                    value={item.user_name}
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['user_name']: e.target.value
                        }
                      )
                    }} />
                  {router.query?.edit_category == 'add' &&
                    <>
                      <TextField
                        label='패스워드'
                        value={item.user_pw}

                        type='password'
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['user_pw']: e.target.value
                            }
                          )
                        }} />
                    </>}
                  <TextField
                    label='닉네임'
                    value={item.nickname}
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['nickname']: e.target.value
                        }
                      )
                    }} />
                  <TextField
                    label='이름'
                    value={item.name}
                    placeholder=""
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['name']: e.target.value
                        }
                      )
                    }} />
                  <TextField
                    label='전화번호'
                    value={item.phone_num}
                    placeholder="하이픈(-) 제외 입력"
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['phone_num']: e.target.value
                        }
                      )
                    }} />
                  <Stack spacing={1}>
                    <TextField
                      fullWidth
                      label="고객메모"
                      multiline
                      rows={4}
                      value={item.note}
                      onChange={(e) => {
                        setItem({
                          ...item,
                          ['note']: e.target.value
                        })
                      }}
                    />
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={1} style={{ display: 'flex' }}>
                  <Button variant="contained" style={{
                    height: '48px', width: '120px', marginLeft: 'auto'
                  }} onClick={() => {
                    setModal({
                      func: () => { onSave() },
                      icon: 'material-symbols:edit-outline',
                      title: '저장 하시겠습니까?'
                    })
                  }}>
                    저장
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </>}
    </>
  )
}
CustomerEdit.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default CustomerEdit
