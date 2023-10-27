import { Icon } from '@iconify/react'
import Slider from 'react-slick'
import styled from 'styled-components'
import { Row, themeObj } from 'src/components/elements/styled-components'
import _ from 'lodash'
import { useState } from 'react'
import { IconButton } from '@mui/material'

const FullWrappers = styled.div`
  width:100%;
  display:flex;
  min-height: 600px;
  background-image: url('/images/test/notice-banner.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: fixed;
  margin: 0 auto;
  background-attachment: fixed;
  @media (max-width:1200px){
    flex-direction:column;
    min-height: 800px;
  }
`
const ContentWrappers = styled.div`
width:50%;
display:flex;
flex-direction:column;
align-items:center;
@media (max-width:1200px){
  width:100%;
  margin:4rem auto 0 auto;
}
`
const Content = styled.div`
margin: auto;
display:flex;
flex-direction:column;
align-items:center;
width:100%;

`
const PostBox = styled.div`
padding:1rem;
display:flex;
flex-direction:column;
border:1px solid #fff;
width:600px;
background:#00000099;
@media (max-width:1200px){
  width:80%;
}
`
const PostCategoryTabContainer = styled.div`
display:flex;
overflow-x: auto;
white-space: nowrap;
margin: 0 auto;
width:600px;
@media (max-width:1200px){
  width:80%;
}
`
const PostCategoryTab = styled.div`
padding:0.5rem;
cursor:pointer;
font-size:${themeObj.font_size.size5};
`
const PostCategoryTitle = styled.div`
width:100%;
font-size:${themeObj.font_size.size3};
font-weight:bold;
padding:0 0 0.5rem 0;
border-bottom:1px solid #fff;
justify-content:space-between;
display:flex;

`
const PostTitle = styled.div`
margin: 0.2rem 0;
cursor:pointer;
`
const HomePost = (props) => {
  const { column, data, func, is_manager } = props;
  const { themeDnsData } = data;
  const { router } = func;
  const { style } = column;
  const [categoryId, setCategoryId] = useState(column?.categories[0]?.id);
  return (
    <>
      <FullWrappers style={{ marginTop: `${style?.margin_top}px`, backgroundImage:`${column?.src?`url(${column?.src})`:''}` }}>
        <ContentWrappers>
          <Content style={{ color: '#fff' }}>
            <div style={{ fontSize: themeObj.font_size.size5 }}>CALL CENTER</div>
            <div style={{ fontSize: themeObj.font_size.size3 }}>PHONE: {themeDnsData?.phone_num}</div>
            <div style={{ fontSize: themeObj.font_size.size3 }}>FAX: {themeDnsData?.fax_num}</div>
          </Content>
        </ContentWrappers>
        <ContentWrappers>
          <Content style={{ color: '#fff', margin: '4rem auto' }}>
            <PostCategoryTabContainer>
              {column?.categories && column?.categories.map((cate, idx) => (
                <>
                  <PostCategoryTab
                    style={{ fontWeight: `${cate?.id == categoryId ? 'bold' : ''}` }}
                    onClick={() => {
                      setCategoryId(cate?.id)
                    }}>{cate?.post_category_title}</PostCategoryTab>
                </>
              ))}
            </PostCategoryTabContainer>
            <PostBox>
              <PostCategoryTitle>
                <div>
                  {_.find(column?.categories, { id: categoryId })?.post_category_title}
                </div>
                <IconButton onClick={() => router.push(`/shop/service/${categoryId}`)}>
                  <Icon icon={'ic:baseline-plus'} style={{ color: '#fff' }} />
                </IconButton>
              </PostCategoryTitle>
              {column?.posts[categoryId] && column?.posts[categoryId].map((item, idx) => (
                <>
                  <PostTitle onClick={() => router.push(`/shop/service/${categoryId}/${item?.id}/`)}>{item?.post_title}</PostTitle>
                </>
              ))}
            </PostBox>
          </Content>
        </ContentWrappers>
      </FullWrappers>
    </>
  )
}
export default HomePost;