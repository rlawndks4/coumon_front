import { Avatar, Button, Card, CardHeader, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

const ContractEdit = () => {
  const { setModal } = useModal()
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(defaultManagerObj.products);
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    settingPage();
  }, [])
  const settingPage = async () => {
    let category_content = await apiManager('product-categories', 'list');
    setCategoryList(category_content?.content);
    if (router.query?.edit_category == 'edit') {
      let data = await apiManager('products', 'get', {
        id: router.query.id
      })
      console.log(data)
      setItem(data);
    }
    setLoading(false);
  }
  const onSave = async () => {
    let result = undefined
    console.log(item)
    if (item?.id) {//수정
      result = await apiManager('products', 'update', item);
    } else {//추가
      result = await apiManager('products', 'create', item);
    }
    if (result) {
      toast.success("성공적으로 저장 되었습니다.");
      router.push(`/manager/product`);
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
                      상품 이미지
                    </Typography>
                    <Upload file={item.product_file || item.product_img} onDrop={(acceptedFiles) => {
                      const newFile = acceptedFiles[0];
                      if (newFile) {
                        setItem(
                          {
                            ...item,
                            ['product_file']: Object.assign(newFile, {
                              preview: URL.createObjectURL(newFile),
                            })
                          }
                        );
                      }
                    }} onDelete={() => {
                      setItem(
                        {
                          ...item,
                          ['product_img']: '',
                          ['product_file']: undefined,
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
                  <FormControl>
                    <InputLabel>상품카테고리</InputLabel>
                    <Select label='쇼핑몰 데모넘버' value={item?.category_id} onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          category_id: e.target.value
                        }
                      )
                    }}>
                      {categoryList.map((item, idx) => {
                        return <MenuItem value={item?.id}>{item?.name}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    label='상품명'
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
                    label='가격'
                    value={item.price}
                    onChange={(e) => {
                      setItem(
                        {
                          ...item,
                          ['price']: e.target.value
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
ContractEdit.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default ContractEdit