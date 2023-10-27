import styled from 'styled-components'
import { useSettingsContext } from '../settings'
import { useState } from 'react'
import { Chip, IconButton } from '@mui/material'
import { Icon } from '@iconify/react'
import { commarNumber } from 'src/utils/function'
import { useRouter } from 'next/router'
import { product_status_list } from 'src/data/status-data'

export const themeObj = {
  grey: {
    0: '#FFFFFF',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
  },
  font_size: {
    size1: '54px',
    size2: '32px',
    size3: '28px',
    size4: '24px',
    size5: '20px',
    size6: '18px',
    size7: '16px',
    size8: '14px',
    size9: '12px',
    size10: '10px',
    size11: '8px',
  }
}

export const Row = styled.div`
display: flex;
`
export const Col = styled.div`
display: flex;
flex-direction:column;
`
export const RowMobileColumn = styled.div`
display: flex;
@media (max-width:1000px) {
    flex-direction:column;
}
`
export const Title = styled.div`
margin: 5rem auto 1rem auto;
font-size:${themeObj.font_size.size3};
font-weight:bold;
`
export const SideTitle = styled.div`
margin: 1rem auto 1rem 0;
font-size:${themeObj.font_size.size3};
font-weight:bold;
`
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
align-items:center;
flex-wrap:wrap;
`
const ItemContainer = styled.div`
width:100%;
display:flex;
flex-direction:column;
cursor:pointer;
transition: 0.5s;
position: relative;
&:hover{
  transform: translateY(-8px);
}
`
const ItemImg = styled.img`
height: 15rem;
width:auto;
margin:auto;
margin-top:3rem;
@media (max-width:1000px) {
  height: 10rem;
}
`
const ItemTextContainer = styled.div`
display:flex;
flex-direction: column;
margin-top:3rem;
`

export const Item = (props) => {

  const { item, router } = props;
  const onClickHeart = () => {
    insertWishDataUtil(item, themeWishData, onChangeWishData);
  }
  return (
    <>
      <ItemContainer style={{
        columnGap: `0.5rem`,
        rowGap: `0.5rem`,
      }}
      >
        <ItemImg src={item.product_img}
          onClick={() => {
            if (item?.id) {
              router.push(`/shop/item/${item?.id}`)
            }
          }} >
        </ItemImg>
        <ItemTextContainer
          onClick={() => {
            if (item?.id) {
              router.push(`/shop/item/${item?.id}`)
            }
          }}>
          <ItemName>{item.name}</ItemName>
          <ItemSubName>{item.sub_name}</ItemSubName>
          <ItemPrice style={{
            marginTop: 'auto',
          }}>
            <div>{commarNumber(item.price)} 원</div>
            <Chip label={product_status_list[item.status].title} variant="soft" color={product_status_list[item.status].chip_color} style={{ marginLeft: 'auto' }} />
          </ItemPrice>
        </ItemTextContainer>
      </ItemContainer>
    </>
  )
}

const ItemsContainer = styled.div`
display:flex;
flex-wrap:wrap;
column-gap: 2%;
row-gap: 2rem;
width:100%;
@media (max-width: 650px) {
  column-gap: 2%;
}
`
const ItemWrapper = styled.div`
width:18.4%;
@media (max-width: 1150px) {
  width:32%;
}
@media (max-width: 850px) {
  width:49%;
}
@media (max-width: 650px) {
  width:49%;
}
`
export const Items = (props) => {
  const { themeDnsData } = useSettingsContext();
  const { items, theme_css, is_slide } = props;
  const router = useRouter();
  const getSlideToShow = () => {
    if (window.innerWidth > 1350) {
      return 5
    }
    if (window.innerWidth > 1000) {
      return 3
    }
    return 2
  }
  const items_setting = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: getSlideToShow(),
    slidesToScroll: 1,
    dots: false,
  }
  return (
    <>
      {is_slide ?
        <>
          <Slider {...items_setting} className='margin-slide'>
            {items && items.map((item, idx) => {
              return <ItemWrapper>
                <Item item={item} router={router} />
              </ItemWrapper>
            })}
          </Slider>
        </>
        :
        <>
          <ItemsContainer>
            {items && items.map((item, idx) => {
              return <ItemWrapper>
                <Item item={item} router={router} />
              </ItemWrapper>
            })}
          </ItemsContainer>
        </>}
    </>
  )
}