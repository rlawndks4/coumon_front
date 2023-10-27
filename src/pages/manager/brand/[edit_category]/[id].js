
import { Avatar, Button, Card, CardHeader, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Tab, Tabs, TextField, TextareaAutosize, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Row, themeObj } from "src/components/elements/styled-components";
import { useSettingsContext } from "src/components/settings";
import { Upload } from "src/components/upload";
import { base64toFile, getAllIdsWithParents } from "src/utils/function";
import styled from "styled-components";
import { defaultManagerObj, react_quill_data } from "src/data/manager-data";
import { axiosIns } from "src/utils/axios";
import { toast } from "react-hot-toast";
import { useModal } from "src/components/dialog/ModalProvider";
import dynamic from "next/dynamic";
import axios from "axios";
import { useAuthContext } from "src/auth/useAuthContext";
import ManagerLayout from "src/layouts/manager/ManagerLayout";
import { apiManager } from "src/utils/api-manager";
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})


const KakaoWrappers = styled.div`
width:100%;
background:#b3c9db;
min-height:400px;
display:flex;
padding-bottom: 1rem;
`
const BubbleTail = styled.div`

`
const OgWrappers = styled.div`
border-radius:16px;
background:#fff;
margin-top:0.5rem;
width:400px;

`
const OgImg = styled.div`
width:400px;
height:200px;
border-top-right-radius:16px;
border-top-left-radius:16px;
`
const OgDescription = styled.div`
display:flex;
flex-direction:column;
padding:0.5rem;
`
const BrandEdit = () => {
  const { setModal } = useModal()
  const { themeMode, themeDnsData } = useSettingsContext();
  const { user } = useAuthContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [item, setItem] = useState(defaultManagerObj.brands)
  const tab_list = [
    {
      value: 0,
      label: '기본정보'
    },
    {
      value: 1,
      label: '카카오톡 설정'
    },
    {
      value: 2,
      label: '회사정보'
    },
    ...(router.query?.edit_category == 'add' ? [{
      value: 3,
      label: '사용할 본사 계정'
    }] : []),
    ...(user?.level >= 50 ? [{
      value: 4,
      label: '데모설정'
    }] : []),
  ]

  useEffect(() => {
    settingPage();
  }, [])
  const settingPage = async () => {
    if (router.query?.edit_category != 'add') {
      let brand_data = await apiManager('brands', 'get', {
        id: router.query.id || themeDnsData?.id
      })
      setItem(brand_data);
    }
    setLoading(false);
  }
  const onSave = async () => {
    let result = undefined
    if (item?.id) {//수정
      result = await apiManager('brands', 'update', item);
      if (result) {
        toast.success("성공적으로 저장 되었습니다.");
        window.location.reload();
      }
    } else {//추가
      if (
        !item?.user_name ||
        !item?.user_pw ||
        !item?.user_pw_check
      ) {
        toast.error("본사 계정정보를 입력해 주세요.");
        return;
      }
      if (item?.user_pw != item?.user_pw_check) {
        toast.error("본사 비밀번호가 일치하지 않습니다.");
        return;
      }
      result = await apiManager('brands', 'create', item);
      if (result) {
        toast.success("성공적으로 저장 되었습니다.");
        router.push(`/manager/brand`);
      }
    }

  }
  return (
    <>
      {!loading &&
        <>
          <Row style={{ margin: '0 0 1rem 0', columnGap: '0.5rem' }}>
            {tab_list.map((tab) => (
              <Button
                variant={tab.value == currentTab ? 'contained' : 'outlined'}
                onClick={() => {
                  setCurrentTab(tab.value)
                }}
              >{tab.label}</Button>
            ))}
          </Row>
          <Grid container spacing={3}>
            {currentTab == 0 &&
              <>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={3}>
                      <Stack spacing={1}>
                        <CardHeader title={`브랜드 이미지 설정`} sx={{ padding: '0' }} />
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          브랜드로고
                        </Typography>
                        <Upload file={item.logo_file || item.logo_img} onDrop={(acceptedFiles) => {
                          const newFile = acceptedFiles[0];
                          if (newFile) {
                            setItem(
                              {
                                ...item,
                                ['logo_file']: Object.assign(newFile, {
                                  preview: URL.createObjectURL(newFile),
                                })
                              }
                            );
                          }
                        }} onDelete={() => {
                          setItem(
                            {
                              ...item,
                              ['logo_img']: '',
                              ['logo_file']: undefined,
                            }
                          )
                        }}
                        />
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          브랜드 다크모드 로고
                        </Typography>
                        <Upload file={item.dark_logo_file || item.dark_logo_img} onDrop={(acceptedFiles) => {
                          const newFile = acceptedFiles[0];
                          if (newFile) {
                            setItem(
                              {
                                ...item,
                                ['dark_logo_file']: Object.assign(newFile, {
                                  preview: URL.createObjectURL(newFile),
                                })
                              }
                            );
                          }
                        }} onDelete={() => {
                          setItem(
                            {
                              ...item,
                              ['dark_logo_img']: '',
                              ['dark_logo_file']: undefined,
                            }
                          )
                        }}
                        />
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          브랜드 파비콘
                        </Typography>
                        <Upload file={item.favicon_file || item.favicon_img} onDrop={(acceptedFiles) => {
                          const newFile = acceptedFiles[0];
                          if (newFile) {
                            setItem(
                              {
                                ...item,
                                ['favicon_file']: Object.assign(newFile, {
                                  preview: URL.createObjectURL(newFile),
                                })
                              }
                            );
                          }
                        }} onDelete={() => {
                          setItem(
                            {
                              ...item,
                              ['favicon_img']: '',
                              ['favicon_file']: undefined,
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
                        label='브랜드명'
                        value={item.name}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['name']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='도메인'
                        value={item.dns}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['dns']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='메인색상'
                        value={item.theme_css?.main_color}
                        type="color"
                        style={{
                          border: 'none'
                        }}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['theme_css']: {
                                ...item.theme_css,
                                main_color: e.target.value
                              }
                            }
                          )
                        }} />
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          비고
                        </Typography>
                        <ReactQuill
                          className="max-height-editor"
                          theme={'snow'}
                          id={'content'}
                          placeholder={''}
                          value={item.note}
                          modules={react_quill_data.modules}
                          formats={react_quill_data.formats}
                          onChange={async (e) => {
                            let note = e;
                            if (e.includes('<img src="') && e.includes('base64,')) {
                              let base64_list = e.split('<img src="');
                              for (var i = 0; i < base64_list.length; i++) {
                                if (base64_list[i].includes('base64,')) {
                                  let img_src = base64_list[i];
                                  img_src = await img_src.split(`"></p>`);
                                  let base64 = img_src[0];
                                  img_src = await base64toFile(img_src[0], 'note.png');
                                  const response = await apiManager('upload/single', 'create', {
                                    post_file: img_src,
                                  })
                                  note = await note.replace(base64, response?.url)
                                }
                              }
                            }
                            setItem({
                              ...item,
                              ['note']: note
                            });
                          }} />
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              </>}
            {currentTab == 1 &&
              <>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={3}>
                      <Stack spacing={1}>
                        <CardHeader title={`카카오 미리보기 설정`} sx={{ padding: '0' }} />
                      </Stack>
                      <TextField
                        fullWidth
                        label="미리보기 디스트립션"
                        multiline
                        rows={4}
                        value={item.og_description}
                        onChange={(e) => {
                          setItem({
                            ...item,
                            ['og_description']: e.target.value
                          })
                        }}
                      />
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          미리보기 이미지
                        </Typography>
                        <Upload file={item.og_file || item.og_img} onDrop={(acceptedFiles) => {
                          const newFile = acceptedFiles[0];
                          if (newFile) {
                            setItem(
                              {
                                ...item,
                                ['og_file']: Object.assign(newFile, {
                                  preview: URL.createObjectURL(newFile),
                                })
                              }
                            );
                          }
                        }} onDelete={() => {
                          setItem(
                            {
                              ...item,
                              ['og_img']: '',
                              ['og_file']: undefined
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
                      <Stack spacing={1}>
                        <CardHeader title={`카카오톡 링크 전송 시 예시`} sx={{ padding: '0' }} />
                        <KakaoWrappers>
                          <Avatar style={{ margin: '0.5rem' }} />
                          <Row style={{ flexDirection: 'column', marginTop: '0.5rem' }}>
                            <div>사용자</div>
                            <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '16px', color: 'blue', textDecoration: 'underline', width: 'auto', maxWidth: '300px' }}>
                              {'https://' + item?.dns}
                            </div>
                            <OgWrappers>
                              {(item?.og_img || item?.og_file) ?
                                <>
                                  <OgImg style={{
                                    backgroundImage: `url(${item?.og_file ? URL.createObjectURL(item?.og_file) : item?.og_img})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center'
                                  }} />
                                </>
                                :
                                <>
                                </>}
                              <OgDescription>
                                <div>{item?.name ? item?.name : '미리보기가 없습니다.'}</div>
                                <div style={{ fontSize: themeObj.font_size.size8, color: themeObj.grey[700], wordBreak: 'break-all' }}>{item?.og_description ? item?.og_description : '여기를 눌러 링크를 확인하세요.'}</div>
                                <div style={{ fontSize: themeObj.font_size.size9, color: themeObj.grey[500], marginTop: '0.5rem' }}>{window.location.origin}</div>
                              </OgDescription>
                            </OgWrappers>
                          </Row>
                        </KakaoWrappers>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              </>}
            {currentTab == 2 &&
              <>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={3}>
                      <TextField
                        label='회사명'
                        value={item.company_name}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['company_name']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='사업자번호'
                        value={item.business_num}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['business_num']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='주민등록번호'
                        value={item.resident_num}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['resident_num']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='대표자명'
                        value={item.ceo_name}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['ceo_name']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='개인정보 책임자명'
                        value={item.pvcy_rep_name}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['pvcy_rep_name']: e.target.value
                            }
                          )
                        }} />
                    </Stack>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={3}>
                      <TextField
                        label='주소'
                        value={item.addr}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['addr']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='휴대폰번호'
                        value={item.phone_num}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['phone_num']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='팩스번호'
                        value={item.fax_num}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['fax_num']: e.target.value
                            }
                          )
                        }} />
                    </Stack>
                  </Card>
                </Grid>
              </>}
            {currentTab == 3 &&
              <>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={3}>
                      <TextField
                        label='본사아이디'
                        value={item?.user_name}
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['user_name']: e.target.value
                            }
                          )
                        }} />
                    </Stack>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={3}>
                      <TextField
                        label='본사 비밀번호'
                        value={item?.user_pw}
                        type='password'
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['user_pw']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='본사 비밀번호 확인'
                        value={item?.user_pw_check}
                        type='password'
                        onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['user_pw_check']: e.target.value
                            }
                          )
                        }} />
                    </Stack>
                  </Card>
                </Grid>
              </>}
            {currentTab == 4 &&
              <>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={3}>
                      <FormControl>
                        <InputLabel>쇼핑몰 데모넘버</InputLabel>
                        <Select label='쇼핑몰 데모넘버' value={item.setting_obj?.shop_demo_num} onChange={(e) => {
                          setItem(
                            {
                              ...item,
                              ['setting_obj']: {
                                ...item.setting_obj,
                                shop_demo_num: e.target.value
                              }
                            }
                          )
                        }}>
                          <MenuItem value={0}>사용안함</MenuItem>
                          {[1, 2, 3].map((num, idx) => {
                            return <MenuItem value={num}>데모 {num}</MenuItem>
                          })}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={3}>

                    </Stack>
                  </Card>
                </Grid>
              </>}
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
BrandEdit.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default BrandEdit
