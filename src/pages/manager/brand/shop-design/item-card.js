import { Button, Card, CardHeader, Container, Grid, Input, MenuItem, Select, Slider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Item } from "src/components/elements/shop/common";
import { themeObj } from "src/components/elements/styled-components";
import { useSettingsContext } from "src/components/settings";
import { defaultManagerObj } from "src/data/manager-data";
import ManagerLayout from "src/layouts/manager/ManagerLayout";
import { getBrandByManager, updateBrandByManager } from "src/utils/api-manager";
import { commarNumber } from "src/utils/function";
import styled from "styled-components";
import { useModal } from "src/components/dialog/ModalProvider";
import { toast } from "react-hot-toast";

const ItemName = styled.div`
font-weight: bold;
font-size:${themeObj.font_size.size7};
word-break: break-all;
`
const ItemSubName = styled.div`
margin-top:0.25rem;
color:${themeObj.grey[500]};
font-size:${themeObj.font_size.size8};
word-break: break-all;
`
const ItemPrice = styled.div`
margin-top:0.5rem;
font-size:${themeObj.font_size.size7};
display:flex;
align-items:end;
`
const ItemContainer = styled.div`
width:100%;
display:flex;
`
const ItemImg = styled.img`

`
const ItemTextContainer = styled.div`
display:flex;
flex-direction: column;
`
//메인화면
export const itemThemeCssDefaultSetting = {
  image: {
    ratio: 1,
    border_radius: 8,
  },
  shadow: {
    color: '#000000',
    darkness: 0,
    width: 16,
    x: 0,
    y: 0
  },
  container: {
    is_vertical: 0,
    padding: 0,
    border_color: '#000000',
    border_width: 0,
    border_radius: 0,
  }
}
const ItemCard = () => {
  const { setModal } = useModal()
  const { themeDnsData } = useSettingsContext();
  const [item, setItem] = useState(defaultManagerObj.brands);
  const [itemThemeCss, setItemThemeCss] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [testText, setTestText] = useState({
    product_name: 'LED 레몬트리 스탠드',
    product_comment: '유연함으로 흠징방지 및 보호에 도움',
    product_price: 10000,
    product_sale_price: 8000
  })
  useEffect(() => {
    settingPage();
  }, [])
  useEffect(() => {
    if (itemThemeCss) {
      setLoading(false);
    }
  }, [itemThemeCss])
  const settingBrandObj = (item, brand_data) => {
    let obj = item;
    let brand_data_keys = Object.keys(brand_data);
    for (var i = 0; i < brand_data_keys.length; i++) {
      if (brand_data[brand_data_keys[i]]) {
        obj[brand_data_keys[i]] = brand_data[brand_data_keys[i]];
      }
    }
    return obj;
  }
  const settingPage = async () => {
    let brand_data = await getBrandByManager({
      id: themeDnsData?.id
    })
    brand_data = settingBrandObj(item, brand_data);
    setItemThemeCss(brand_data?.theme_css?.shop_item_card_css || itemThemeCssDefaultSetting)
    setItem(brand_data);
  }

  const onSave = async () => {
    let brand_data = item;
    brand_data['theme_css']['shop_item_card_css'] = itemThemeCss;
    let result = await updateBrandByManager({ ...brand_data, id: themeDnsData?.id })
    if (result) {
      toast.success("성공적으로 저장 되었습니다.");
      window.location.reload();
    }
  }
  return (
    <>
      {!loading &&
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 5 }}>
                <Stack spacing={1}>
                  <CardHeader title="이미지" sx={{ paddingLeft: '0' }} />
                  {/* <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                이미지 가로세로 비율
              </Typography>
              <Slider
                value={itemThemeCss.image.ratio}
                onChange={(e) => {
                  setItemThemeCss({ ...itemThemeCss, ['image']: { ...itemThemeCss.image, ['ratio']: e.target.value } })
                }}
                valueLabelFormat={(value) => {
                  return `가로 ${10} : 세로 ${value * 10}`
                }}
                valueLabelDisplay="auto"
                min={0.5}
                step={0.05}
                max={2}
              /> */}
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    테두리둥근정도
                  </Typography>
                  <Slider
                    value={itemThemeCss.image.border_radius}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['image']: { ...itemThemeCss.image, ['border_radius']: e.target.value } })
                    }}
                    valueLabelFormat={(value) => {
                      return `${value}px`
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    step={1}
                    max={50}
                  />

                  <CardHeader title="그림자" sx={{ paddingLeft: '0' }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    그림자색상
                  </Typography>
                  <Input type="color" value={itemThemeCss.shadow.color}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['shadow']: { ...itemThemeCss.shadow, ['color']: e.target.value } })
                    }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    그림자 진한정도 (투명도)
                  </Typography>
                  <Slider
                    value={itemThemeCss.shadow.darkness}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['shadow']: { ...itemThemeCss.shadow, ['darkness']: e.target.value } })
                    }}
                    valueLabelFormat={(value) => {
                      return `${value}`
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    step={1}
                    max={99}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    그림자 퍼짐 정도
                  </Typography>
                  <Slider
                    type="color" value={itemThemeCss.shadow.width}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['shadow']: { ...itemThemeCss.shadow, ['width']: e.target.value } })
                    }}
                    valueLabelFormat={(value) => {
                      return `${value}px`
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    step={1}
                    max={50}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    그림자 가로방향
                  </Typography>
                  <Slider
                    type="color" value={itemThemeCss.shadow.x}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['shadow']: { ...itemThemeCss.shadow, ['x']: e.target.value } })
                    }}
                    valueLabelFormat={(value) => {
                      return `x: ${value}px`
                    }}
                    valueLabelDisplay="auto"
                    min={-50}
                    step={1}
                    max={50}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    그림자 세로방향
                  </Typography>
                  <Slider
                    type="color" value={itemThemeCss.shadow.y}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['shadow']: { ...itemThemeCss.shadow, ['y']: e.target.value } })
                    }}
                    valueLabelFormat={(value) => {
                      return `y: ${value}px`
                    }}
                    valueLabelDisplay="auto"
                    min={-50}
                    step={1}
                    max={50}
                  />
                  <CardHeader title="컨테이너" sx={{ paddingLeft: '0' }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    이미지 및 텍스트 배치
                  </Typography>
                  <Select value={itemThemeCss.container.is_vertical} onChange={(e) => {
                    setItemThemeCss({ ...itemThemeCss, ['container']: { ...itemThemeCss.container, ['is_vertical']: e.target.value } })
                  }}>
                    <MenuItem value={0}>수평형 (horizontality)</MenuItem>
                    <MenuItem value={1}>수직형 (verticality)</MenuItem>
                  </Select>


                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    패딩
                  </Typography>
                  <Slider
                    value={itemThemeCss.container.padding}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['container']: { ...itemThemeCss.container, ['padding']: e.target.value } })
                    }}
                    valueLabelFormat={(value) => {
                      return `컨텐츠 가로기준 ${value}%`
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    step={0.05}
                    max={20}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    테두리색
                  </Typography>
                  <Input type="color"
                    value={itemThemeCss.container.border_color}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['container']: { ...itemThemeCss.container, ['border_color']: e.target.value } })
                    }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    테두리두께
                  </Typography>
                  <Slider
                    value={itemThemeCss.container.border_width}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['container']: { ...itemThemeCss.container, ['border_width']: e.target.value } })
                    }}
                    valueLabelFormat={(value) => {
                      return `${value}px`
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    step={1}
                    max={20}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    테두리둥근정도
                  </Typography>
                  <Slider
                    value={itemThemeCss.container.border_radius}
                    onChange={(e) => {
                      setItemThemeCss({ ...itemThemeCss, ['container']: { ...itemThemeCss.container, ['border_radius']: e.target.value } })
                    }}
                    valueLabelFormat={(value) => {
                      return `${value}px`
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    step={1}
                    max={50}
                  />
                  <CardHeader title="테스트 상품 정보 입력" sx={{ paddingLeft: '0' }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    테스트 상품명
                  </Typography>
                  <TextField value={testText.product_name} onChange={(e) => { setTestText({ ...testText, ['product_name']: e.target.value }) }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    테스트 상품서브명
                  </Typography>
                  <TextField value={testText.product_comment} onChange={(e) => { setTestText({ ...testText, ['product_comment']: e.target.value }) }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    테스트 상품시장가
                  </Typography>
                  <TextField value={testText.product_price} onChange={(e) => { setTestText({ ...testText, ['product_price']: e.target.value }) }} type="number" />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    테스트 상품판매가
                  </Typography>
                  <TextField value={testText.product_sale_price} onChange={(e) => { setTestText({ ...testText, ['product_sale_price']: e.target.value }) }} type="number" />
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={0.5} />
            <Grid item xs={12} md={4} style={{
              position: `${window.innerWidth > 900 ? 'fixed' : ''}`,
              right: `${itemThemeCss.container.is_vertical == 1 ? '5%' : '15%'}`,
              top: '5rem',
              width: `${itemThemeCss.container.is_vertical == 1 ? '700px' : '350px'}`,
            }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  상품예시
                </Typography>
                <Item item={{
                  product_img: '/images/test/testitem9.jpg',
                  product_name: testText.product_name,
                  product_comment: testText.product_comment,
                  product_sale_price: testText.product_sale_price,
                  product_price: testText.product_price,
                }}
                  theme_css={itemThemeCss}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={0.5} />
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={1}>
                  <Button variant="contained" style={{
                    height: '48px', width: '120px', marginLeft: 'auto'
                  }}
                    onClick={() => {
                      setModal({
                        func: () => { onSave() },
                        icon: 'material-symbols:edit-outline',
                        title: '저장 하시겠습니까?'
                      })
                    }}
                  >
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
ItemCard.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default ItemCard;
