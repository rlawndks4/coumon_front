import styled from "styled-components";
import { Row, themeObj } from "../styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { commarNumber } from "src/utils/function";
import { itemThemeCssDefaultSetting } from "src/pages/manager/brand/shop-design/item-card";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import Slider from "react-slick";
import { useSettingsContext } from "src/components/settings";
import _ from "lodash";
import { Title } from 'src/components/elements/styled-components';
import PropTypes from 'prop-types';
// @mui
import { Box, Card, Pagination, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
// components
import { TableHeadCustom } from 'src/components/table';
//
import { test_items } from 'src/data/test-data';
import Image from 'src/components/image/Image';
import { fCurrency } from 'src/utils/formatNumber';
import { getPayHistoriesByUser } from 'src/utils/api-shop';
import { getTrxStatusByNumber, makeMaxPage } from 'src/utils/function';
import { insertWishDataUtil } from "src/utils/shop-util";
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
flex-wrap:wrap;
`
const ItemContainer = styled.div`
width:100%;
display:flex;
cursor:pointer;
transition: 0.5s;
position: relative;
&:hover{
  transform: translateY(-8px);
}
`
const ItemImg = styled.img`
`
const ItemTextContainer = styled.div`
display:flex;
flex-direction: column;
`

export const Item = (props) => {

  const { themeWishData, onChangeWishData } = useSettingsContext();
  const { item, router, theme_css } = props;
  const [itemThemeCss, setItemThemeCss] = useState(itemThemeCssDefaultSetting);
  useEffect(() => {
    if (theme_css) {
      setItemThemeCss(theme_css)
    }
  }, [theme_css])
  const onClickHeart = () => {
    insertWishDataUtil(item, themeWishData, onChangeWishData);
  }
  return (
    <>
      <ItemContainer style={{
        padding: `${itemThemeCss?.container?.padding}%`,
        columnGap: `0.5rem`,
        rowGap: `0.5rem`,
        flexDirection: `${itemThemeCss.container.is_vertical == 0 ? 'column' : 'row'}`,
        border: `${itemThemeCss.container.border_width}px solid ${itemThemeCss.container.border_color}`,
        borderRadius: `${itemThemeCss.container.border_radius}px`,
        boxShadow: `${itemThemeCss.shadow.x}px ${itemThemeCss.shadow.y * (-1)}px ${itemThemeCss.shadow.width}px ${itemThemeCss.shadow.color}${itemThemeCss.shadow.darkness > 9 ? '' : '0'}${itemThemeCss.shadow.darkness}`
      }}
      >
        <IconButton sx={{ position: 'absolute', right: '2px', top: '2px' }} onClick={onClickHeart}>
          <Icon icon={themeWishData.includes(item?.id) ? 'mdi:heart' : 'mdi:heart-outline'} fontSize={'2rem'} style={{
            color: `${themeWishData.includes(item?.id) ? 'red' : ''}`
          }} />
        </IconButton>
        <ItemImg src={item.product_img} style={{
          width: `${itemThemeCss.container.is_vertical == 0 ? '100%' : '50%'}`,
          height: `auto`,
          borderRadius: `${itemThemeCss.image.border_radius}px`,
        }}
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
          <ItemSubName>{item.comment}</ItemSubName>
          <ItemPrice style={{
            marginTop: 'auto'
          }}>
           
            <div>{commarNumber(item.price)} 원</div>
           
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
  column-gap: ${props => props.theme_css?.container?.is_vertical == 1 ? '0' : '2%'};;
}
`
const ItemWrapper = styled.div`
width:${props => props.theme_css?.container?.is_vertical == 1 ? '32%' : '18.4%'};
@media (max-width: 1150px) {
  width:${props => props.theme_css?.container?.is_vertical == 1 ? '49%' : '32%'};
}
@media (max-width: 850px) {
  width:49%;
}
@media (max-width: 650px) {
  width:${props => props.theme_css?.container?.is_vertical == 1 ? '100%' : '49%'};
}
`
export const Items = (props) => {
  const { themeDnsData } = useSettingsContext();
  const { items, router, theme_css, is_slide } = props;
  const [itemThemeCss, setItemThemeCss] = useState(itemThemeCssDefaultSetting);
  useEffect(() => {
    if (themeDnsData) {
      setItemThemeCss(Object.assign(itemThemeCss, themeDnsData?.theme_css?.shop_item_card_css));
    }
  }, [themeDnsData])
  const getSlideToShow = () => {
    if (window.innerWidth > 1350) {
      if (itemThemeCss?.container?.is_vertical == 1) {
        return 3
      } else {
        return 5
      }
    }
    if (window.innerWidth > 1000) {
      if (itemThemeCss?.container?.is_vertical == 1) {
        return 2
      } else {
        return 3
      }
    }
    if (itemThemeCss?.container?.is_vertical == 1) {
      return 1
    } else {
      return 2
    }
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
              return <ItemWrapper theme_css={itemThemeCss}>
                <Item item={item} router={router} theme_css={itemThemeCss} />
              </ItemWrapper>
            })}
          </Slider>
        </>
        :
        <>
          <ItemsContainer theme_css={itemThemeCss}>
            {items && items.map((item, idx) => {
              return <ItemWrapper theme_css={itemThemeCss}>
                <Item item={item} router={router} theme_css={itemThemeCss} />
              </ItemWrapper>
            })}
          </ItemsContainer>
        </>}
    </>
  )
}

export const HistoryTable = (props) => {
  const { historyContent, headLabel } = props;
  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 720, overflowX: 'auto' }}>
          <TableHeadCustom headLabel={headLabel} />
          <TableBody>
            {historyContent?.content && historyContent?.content.map((row) => (
              <>
                <TableRow>
                  <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                      alt="product image"
                      src={row.product_img}
                      sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }}
                    />
                    <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {fCurrency(row.amount)}원
                  </TableCell>
                  <TableCell>
                    {row?.buyer_name}
                  </TableCell>
                  <TableCell>
                    {getTrxStatusByNumber(row?.trx_status)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ textAlign: 'right', color: 'text.secondary', }}
                    >
                      {row?.updated_at}
                    </Box>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}