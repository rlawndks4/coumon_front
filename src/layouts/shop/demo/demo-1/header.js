import Logo from "src/components/logo/Logo"
import styled from "styled-components"
import { IconButton, TextField, InputAdornment, Drawer, Badge } from "@mui/material"
import { forwardRef, useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"
import { Row, themeObj } from 'src/components/elements/styled-components'
import { useTheme } from '@mui/material/styles';
import { useSettingsContext } from "src/components/settings"
import { test_categories } from "src/data/test-data"
import { useRouter } from "next/router"
import { TreeItem, TreeView } from "@mui/lab"
import { getAllIdsWithParents } from "src/utils/function"
import DialogSearch from "src/components/dialog/DialogSearch"
import { useAuthContext } from "src/auth/useAuthContext"
import { logoSrc } from "src/data/data"
import $ from 'jquery'
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})
const Wrappers = styled.header`
width: 100%;
position: fixed;
top: 0;
display: flex;
flex-direction: column;
z-index: 10;
`
const TopMenuContainer = styled.div`
display:flex;
padding: 1rem 0;
max-width: 1600px;
width:90%;
margin: 0 auto;
align-items:center;
position:relative;
@media (max-width:1000px) {
  padding: 0.5rem 0;
}
`
const CategoryContainer = styled.div`
max-width: 1622px;
width:100%;
margin: 0 auto;
display:flex;
align-items:center;
position:relative;
`
const CategoryMenu = styled.div`
padding:1rem 1.5rem 0 1.5rem;
text-align: center;
display:inline-block;
text-transform:uppercase;
margin:0;
cursor:pointer;
font-weight:bold;
position:relative;
&::after {
  padding-bottom:1rem;
  display:block;
  content: '';
  border-bottom:2px solid ${props => props.borderColor};
  transform: scaleX(0);
  transition: transform 250ms ease-in-out;
}
&:hover:after {
  transform: scaleX(1.5);

}
@media (max-width:1000px) {
  padding:0.5rem 1.5rem 0 1.5rem;
  &::after {
    padding-bottom:0.5rem;
  }
}
`

const NoneShowMobile = styled.div`
display: flex;
align-items:center;
@media (max-width:1000px) {
  display: none;
}
`
const ShowMobile = styled.div`
display: none;
align-items:center;
@media (max-width:1000px) {
  display: flex;
}
`
const PaddingTop = styled.div`
margin-top:${props => props.pcHeight}px;
@media (max-width:1000px) {
  margin-top:99px;
}
`
const AuthMenu = styled.div`
padding:0 0.5rem;
font-weight:bold;
color: ${props => props.theme.palette.grey[500]};
&:hover{
  color:${props => props.hoverColor};
}
border-right: 1px solid ${props => props.theme.palette.grey[300]};
`
const DropDownMenuContainer = styled.div`
position: absolute;
top:58px;
z-index:10;
left: -8px;
display: none;
text-align:left;
padding:0.5rem;
.menu-${props => props.parentId}:hover & {
  display: flex;
}
`
const DropDownMenu = styled.div`
width:136px;
padding:0.25rem;
transition-duration:0.5s;
display:flex;
justify-content:space-between;
position: relative;
cursor:pointer;
&:hover{
  background: ${props => props.theme.palette.grey[300]};
}
`
const SubDropDownMenuContainer = styled.div`
position: absolute;
left: 136px;
top:0;
display: none;
text-align:left;
padding:0.5rem;
width:154px;
flex-direction:column;
.menu-${props => props.parentId}:hover & {
  display: flex;
}
`
const SubSubDropDownMenuContainer = styled.div`
position: absolute;
left: 136px;
top:0;
display: none;
text-align:left;
padding:0.5rem;
width:154px;
flex-direction:column;
.menu-${props => props.parentId}:hover & {
  display: flex;
}
`
const PopupContainer = styled.div`
position:fixed;
top:16px;
left:0px;
display:flex;
flex-wrap:wrap;
z-index:9999;
`
const PopupContent = styled.div`
background:#fff;
margin-right:16px;
margin-bottom:16px;
padding:24px 24px 48px 24px;
box-shadow:0px 4px 4px #00000029;
border-radius:8px;
width:300px;
min-height:200px;
position:relative;
opacity:0.95;
z-index:10;
@media screen and (max-width:400px) { 
width:78vw;
}
`
const authList = [
  {
    name: '장바구니',
    link_key: 'cart'
  },
  {
    name: '찜목록',
    link_key: 'wish'
  },
  {
    name: '주문조회',
    link_key: 'history'
  },
  {
    name: '마이페이지',
    link_key: 'my-page'
  },
]
const noneAuthList = [
  {
    name: '로그인',
    link_key: 'login'
  },
  {
    name: '회원가입',
    link_key: 'sign-up'
  },
  {
    name: '비회원 주문조회',
    link_key: 'login?scroll_to=100000'
  },
]
const Header = () => {

  const router = useRouter();
  const theme = useTheme();
  const { themeMode, onToggleMode, onChangeCategoryList, themeCategoryList, themeDnsData, themePopupList, themePostCategoryList, onChangePopupList, onChangePostCategoryList, themeWishData, themeCartData, onChangeCartData, onChangeWishData, themeShopSetting } = useSettingsContext();
  const { user, logout } = useAuthContext();
  const headerWrappersRef = useRef();
  const [headerHeight, setHeaderHeight] = useState(130);
  const [keyword, setKeyword] = useState("");
  const onSearch = () => {
    router.push(`/shop/search?keyword=${keyword}`)
  }
  const [isAuthMenuOver, setIsAuthMenuOver] = useState(false)
  const [hoverItems, setHoverItems] = useState({

  })
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [popups, setPopups] = useState([]);
  const [postCategories, setPostCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  }, [user])
  useEffect(() => {
    setHeaderHeight(headerWrappersRef.current?.clientHeight ?? 130);
  }, [headerWrappersRef.current, categories])
  useEffect(() => {
    if (themeCategoryList) {
      settingHeader();
    }
  }, [themeCategoryList])
  const settingHeader = async () => {
    setLoading(true);
    setPopups(themePopupList)
    setPostCategories(themePostCategoryList);
    setCategories(themeShopSetting?.product_categories ?? [])
    let hover_list = getAllIdsWithParents(themeShopSetting?.product_categories ?? []);
    let hover_items = {};
    for (var i = 0; i < hover_list.length; i++) {
      hover_list[i] = hover_list[i].join('_');
      hover_items[`hover_${hover_list[i]?.id}`] = false;
    }
    hover_items['service'] = false;
    setHoverItems(hover_items);
    setLoading(false);
  }
  const onHoverCategory = (name) => {
    let hover_items = hoverItems;
    for (let key in hover_items) {
      hover_items[key] = false;
    }
    hover_items[name] = true;
    setHoverItems(hover_items);
  }

  const returnDropdownMenu = (item, num) => {
    return (
      <>
        <div style={{ position: 'relative' }} className={`menu-${item?.id}`}>
          <DropDownMenu theme={theme}
            onClick={() => {
              router.push(`/shop/items?category_id=${item?.id}&depth=${num}`)
            }}>
            <div>{item.name}</div>
            <div>{item.children?.length > 0 ? '>' : ''}</div>
          </DropDownMenu>
          {item.children?.length > 0 ?
            <>
              {num == 1 ?
                <>
                  <SubDropDownMenuContainer parentId={item?.id}
                    style={{
                      background: `${themeMode == 'dark' ? '#000' : '#fff'}`,
                      border: `1px solid ${theme.palette.grey[300]}`,
                    }}>
                    {item.children.map((item2, idx) => (
                      <>
                        {returnDropdownMenu(item2, num + 1)}
                      </>
                    ))}
                  </SubDropDownMenuContainer>
                </>
                :
                ''}
              {num == 2 ?
                <>
                  <SubSubDropDownMenuContainer parentId={item?.id}
                    style={{
                      background: `${themeMode == 'dark' ? '#000' : '#fff'}`,
                      border: `1px solid ${theme.palette.grey[300]}`,
                    }}>
                    {item.children.map((item2, idx) => (
                      <>
                        {returnDropdownMenu(item2, num + 1)}
                      </>
                    ))}
                  </SubSubDropDownMenuContainer>
                </>
                :
                ''}
            </>
            :
            <>
            </>}
        </div>
      </>
    )
  }
  const [dialogOpenObj, setDialogOpenObj] = useState({
    search: false
  })
  const handleDialogClose = () => {
    let obj = { ...dialogOpenObj };
    for (let key in obj) {
      obj[key] = false
    }
    setDialogOpenObj(obj);
  }
  const onLogout = async () => {
    let result = await logout();
    onChangeCartData([]);
    onChangeWishData([]);
    if (result) {
      router.push('/shop/auth/login');
    }
  }
  return (
    <>

      <DialogSearch
        open={dialogOpenObj.search}
        handleClose={handleDialogClose}
        root_path={'shop'}
      />
      {loading ?
        <>
        </>
        :
        <>
          {popups.length > 0 && router.asPath == '/shop' ?
            <>
              <PopupContainer>
                {popups && popups.map((item, idx) => (
                  <>
                    { }
                    <PopupContent>
                      <Icon icon='ion:close' style={{ color: `${themeMode == 'dark' ? '#fff' : '#222'}`, position: 'absolute', right: '8px', top: '8px', fontSize: themeObj.font_size.size8, cursor: 'pointer' }} onClick={() => {
                        let popup_list = [...popups];
                        popup_list.splice(idx, 1);
                        setPopups(popup_list);
                      }} />
                      <ReactQuill
                        className='none-padding'
                        value={item?.popup_content ?? `<body></body>`}
                        readOnly={true}
                        theme={"bubble"}
                        bounds={'.app'}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', left: '8px', bottom: '8px' }}>
                        <Icon icon='ion:close' style={{ color: `${themeMode == 'dark' ? '#fff' : '#222'}`, fontSize: themeObj.font_size.size8, marginRight: '4px', cursor: 'pointer' }} onClick={() => { }} />
                        <div style={{ fontSize: themeObj.font_size.size8, }}>오늘 하루 보지않기</div>
                      </div>
                    </PopupContent>

                  </>
                ))}
              </PopupContainer>

            </>
            :
            <>
            </>}
          <Wrappers style={{
            background: `${themeMode == 'dark' ? '#000' : '#fff'}`
          }}
            ref={headerWrappersRef}
          >
            <TopMenuContainer>
              <img src={logoSrc()} style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
                onClick={() => {
                  router.push('/shop')
                }}
              />
              <NoneShowMobile>
                <TextField
                  label='통합검색'
                  id='size-small'
                  size='small'
                  onChange={(e) => {
                    setKeyword(e.target.value)
                  }}
                  value={keyword}
                  sx={{ margin: '0 1rem 0 2rem', maxWidth: '300px' }}
                  onKeyPress={(e) => {
                    if (e.key == 'Enter') {
                      onSearch();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => onSearch()}
                          aria-label='toggle password visibility'
                        >
                          <Icon icon={'tabler:search'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <IconButton
                  sx={iconButtonStyle}
                  onClick={() => {
                    if (user) {
                      router.push(`/shop/auth/my-page`)
                    } else {
                      router.push(`/shop/auth/login`)
                    }
                  }}
                >
                  <Icon icon={'basil:user-outline'} fontSize={'1.8rem'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                </IconButton>
                <IconButton
                  sx={iconButtonStyle}
                  onClick={() => {
                    if (user) {
                      router.push(`/shop/auth/wish`)
                    } else {
                      router.push(`/shop/auth/login`)
                    }
                  }}
                >
                  <Badge badgeContent={themeWishData.length} color="error">
                    <Icon icon={'basil:heart-outline'} fontSize={'2rem'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                  </Badge>
                </IconButton>

                <IconButton
                  sx={iconButtonStyle}
                  onClick={() => {
                    router.push(`/shop/auth/cart`)
                  }}
                >
                  <Badge badgeContent={themeCartData.length} color="error">
                    <Icon icon={'basil:shopping-bag-outline'} fontSize={'1.8rem'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                  </Badge>
                </IconButton>
                <IconButton
                  sx={iconButtonStyle}
                  onClick={() => onToggleMode()}
                >
                  <Icon icon={themeMode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} fontSize={'1.5rem'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                </IconButton>
              </NoneShowMobile>
              <NoneShowMobile style={{ marginLeft: 'auto', cursor: 'pointer', fontSize: '14px' }} onMouseOver={() => {
                setIsAuthMenuOver(true)
              }}
                onMouseLeave={() => {
                  setIsAuthMenuOver(false)
                }}
              >
                <div className="fade-in-text" style={{ display: `${isAuthMenuOver ? 'flex' : 'none'}`, alignItems: 'center' }}>
                  {user ?
                    <>
                      {authList.map((item, idx) => (
                        <>
                          <AuthMenu
                            theme={theme}
                            hoverColor={themeMode == 'dark' ? '#fff' : '#000'}
                            onClick={() => { router.push(`/shop/auth/${item.link_key}`) }}
                          >{item.name}</AuthMenu>
                        </>
                      ))}
                      <AuthMenu
                        theme={theme}
                        hoverColor={themeMode == 'dark' ? '#fff' : '#000'}
                        onClick={onLogout}
                        style={{ borderRight: `none` }}
                      >{'로그아웃'}</AuthMenu>
                    </>
                    :
                    <>
                      {noneAuthList.map((item, idx) => (
                        <>
                          <AuthMenu
                            theme={theme}
                            hoverColor={themeMode == 'dark' ? '#fff' : '#000'}
                            onClick={() => { router.push(`/shop/auth/${item.link_key}`) }}
                            style={{ borderRight: `${idx == noneAuthList.length - 1 ? 'none' : ''}` }}
                          >{item.name}</AuthMenu>
                        </>
                      ))}

                    </>}

                </div>
                <div className="fade-in-text" style={{ display: `${isAuthMenuOver ? 'none' : 'flex'}`, alignItems: 'center' }}>
                  {user ?
                    <>
                      <AuthMenu theme={theme} style={{ borderRight: 'none' }}>마이페이지</AuthMenu>
                    </>
                    :
                    <>
                      <AuthMenu theme={theme}>회원가입</AuthMenu>
                      <AuthMenu theme={theme} style={{ borderRight: 'none' }}>로그인</AuthMenu>
                    </>}

                  <Icon icon={'ic:baseline-plus'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                </div>
              </NoneShowMobile>
              <ShowMobile style={{ marginLeft: 'auto' }}>
                <IconButton
                  sx={iconButtonStyle}
                  onClick={() => setSideMenuOpen(true)}
                >
                  <Icon icon={'basil:menu-solid'} fontSize={'2rem'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                </IconButton>
                <IconButton
                  sx={iconButtonStyle}
                  onClick={() => {
                    setDialogOpenObj({
                      ...dialogOpenObj,
                      ['search']: true
                    })
                  }}
                >
                  <Icon icon={'tabler:search'} fontSize={'1.5rem'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                </IconButton>
                <IconButton
                  sx={iconButtonStyle}
                  onClick={() => {
                    router.push(`/shop/auth/cart`)
                  }}
                >
                  <Badge badgeContent={themeCartData.length} color="error">
                    <Icon icon={'basil:shopping-bag-outline'} fontSize={'1.8rem'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                  </Badge>
                </IconButton>
                <IconButton
                  sx={iconButtonStyle}
                  onClick={() => onToggleMode()}
                >
                  <Icon icon={themeMode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} fontSize={'1.5rem'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                </IconButton>
              </ShowMobile>
            </TopMenuContainer>
            <div style={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }} />

            <CategoryContainer>
              <NoneShowMobile>
                <IconButton
                  onClick={() => setSideMenuOpen(true)}
                  sx={{ marginRight: '1rem' }}
                >
                  <Icon icon={'basil:menu-solid'} fontSize={'2rem'} color={themeMode == 'dark' ? '#fff' : '#000'} />
                </IconButton>
              </NoneShowMobile>
              <NoneShowMobile
                style={{
                  width: '100%',
                  flexWrap: 'wrap'
                }}
                className="none-scroll pc-menu-content"
              >
                {categories.map((item1, idx1) => (
                  <>
                    <div style={{ position: 'relative' }} className={`menu-${item1?.id}`}>
                      <CategoryMenu borderColor={themeMode == 'dark' ? '#fff' : '#000'} onClick={() => {
                        router.push(`/shop/items?category_id=${item1?.id}&depth=0`)
                      }}>
                        <div>{item1.name}</div>
                      </CategoryMenu>
                      {item1?.children?.length > 0 ?
                        <>
                          <DropDownMenuContainer parentId={item1?.id} style={{
                            border: `1px solid ${theme.palette.grey[300]}`,
                            width: `${item1.category_img ? '430px' : '154px'}`,
                            fontSize: '12px',
                            fontWeight: 'normal',
                            background: `${themeMode == 'dark' ? '#000' : '#fff'}`,
                          }}>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              width: '154px'
                            }}>
                              {item1?.children.map((item2, idx2) => (
                                <>
                                  {returnDropdownMenu(item2, 1)}
                                </>
                              ))}
                            </div>
                            {item1.category_img ?
                              <>
                                <img src={item1.category_img} style={{ height: 'auto', width: '270px' }} />
                              </>
                              :
                              <>
                              </>}
                          </DropDownMenuContainer>
                        </>
                        :
                        <>
                        </>}
                    </div>
                  </>
                ))}
                <div style={{ position: 'relative', marginLeft: 'auto' }} className={`menu-service`}>
                  <CategoryMenu borderColor={themeMode == 'dark' ? '#fff' : '#000'} >
                    <div>고객센터</div>
                  </CategoryMenu>
                  <DropDownMenuContainer parentId={'service'} style={{
                    border: `1px solid ${theme.palette.grey[300]}`,
                    width: `154px`,
                    fontSize: '12px',
                    fontWeight: 'normal',
                    background: `${themeMode == 'dark' ? '#000' : '#fff'}`
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '154px'
                    }}>
                      {postCategories.map((item, idx) => (
                        <>
                          <DropDownMenu theme={theme}
                            onClick={() => {
                              router.push(`/shop/service/${item.id}`)
                            }}>
                            <div>{item.post_category_title}</div>
                          </DropDownMenu>
                        </>
                      ))}
                    </div>
                  </DropDownMenuContainer>
                </div>
              </NoneShowMobile>
              <ShowMobile style={{
                whiteSpace: 'nowrap',
                overflowX: 'auto'
              }}
                className="none-scroll"
              >
                {categories.map((item1, idx1) => (
                  <>
                    <CategoryMenu borderColor={themeMode == 'dark' ? '#fff' : '#000'} onMouseOver={() => {
                      onHoverCategory(`hover_${item1?.id}`)
                    }}
                      onClick={() => {
                        router.push(`/shop/items?category_id=${item1?.id}&depth=0`)
                      }}
                    >
                      <div>{item1.name}</div>
                    </CategoryMenu>
                  </>
                ))}
                <CategoryMenu borderColor={themeMode == 'dark' ? '#fff' : '#000'} onClick={() => {

                }}>고객센터</CategoryMenu>
              </ShowMobile>
              <NoneShowMobile style={{
                marginLeft: 'auto'
              }}>
              </NoneShowMobile>
            </CategoryContainer>
            <div style={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }} />
          </Wrappers>
        </>}
      <PaddingTop pcHeight={headerHeight} />
      <Drawer
        anchor={'left'}
        open={sideMenuOpen}
        onClose={() => {
          setSideMenuOpen(false);
        }}
        style={{
        }}
      >
        <ColumnMenuContainer style={{
          background: (themeMode == 'dark' ? '#222' : '#fff'),
          color: (themeMode == 'dark' ? '#fff' : '#000'),
        }}
          className="none-scroll"
        >
          <ColumnMenuTitle>쇼핑 카테고리</ColumnMenuTitle>
          <TreeView
            defaultCollapseIcon={<Icon icon={'ic:baseline-minus'} />}
            defaultExpandIcon={<Icon icon={'ic:baseline-plus'} />}
            defaultEndIcon={<Icon icon={'mdi:dot'} />}
          >
            {categories.map((item1, idx) => (
              <>
                {returnSidebarMenu(item1, 0, {
                  router,
                  setSideMenuOpen
                })}
              </>
            ))}
          </TreeView>
          <ColumnMenuTitle>고객센터</ColumnMenuTitle>
          {postCategories && postCategories.map((item, idx) => (
            <>
              <ColumnMenuContent onClick={() => {
                router.push(`/shop/service/${item.id}`);
                setSideMenuOpen(false);
              }} style={{ paddingLeft: '1rem' }}>{item.post_category_title}</ColumnMenuContent>
            </>
          ))}
          <ColumnMenuTitle>마이페이지</ColumnMenuTitle>
          {user ?
            <>
              {authList.map((item, idx) => (
                <>
                  <ColumnMenuContent onClick={() => {
                    router.push(`/shop/auth/${item.link_key}`);
                    setSideMenuOpen(false);
                  }} style={{ paddingLeft: '1rem' }}>{item.name}</ColumnMenuContent>
                </>
              ))}
              <ColumnMenuContent onClick={() => {
                onLogout();
                setSideMenuOpen(false);
              }} style={{ paddingLeft: '1rem' }}>로그아웃</ColumnMenuContent>
            </>
            :
            <>
              {noneAuthList.map((item, idx) => (
                <>
                  <ColumnMenuContent onClick={() => {
                    router.push(`/shop/auth/${item.link_key}`);
                    setSideMenuOpen(false);
                  }} style={{ paddingLeft: '1rem' }}>{item.name}</ColumnMenuContent>
                </>
              ))}
            </>}

        </ColumnMenuContainer>
      </Drawer>
    </>
  )
}
const returnSidebarMenu = (item, num, func) => {
  const {
    router,
    setSideMenuOpen
  } = func;
  return (
    <>
      <TreeItem label={<div
        style={{
          marginLeft: '0.25rem'
        }}
        onClick={() => {
          router.push(`/shop/items?category_id=${item?.id}&depth=${num}`);
          setSideMenuOpen(false);
        }}>{item.name}</div>}
        nodeId={item.id}
        style={{ margin: '0.25rem 0' }}
      >
        {item.children?.length > 0 &&
          <>
            {item.children.map((item2, idx) => (
              <>
                {returnSidebarMenu(item2, num + 1, func)}
              </>
            ))}
          </>}
      </TreeItem>
    </>
  )
}

const ColumnMenuContainer = styled.div`
        width: 400px;
        padding:0 2rem 4rem 2rem;
        height:100vh;
        overflow-y:auto;
        display:flex;
        flex-direction:column;
        @media (max-width:800px){
          width: 70vw;
        padding:0 5vw 4rem 5vw;
}
        `
const ColumnMenuTitle = styled.div`
        margin: 2rem 0 0.5rem 0;
        font-weight: bold;
`
const ColumnMenuContent = styled.div`
        display:flex;
        align-items:center;
        padding:0.25rem 0;
        cursor:pointer;
        `
const iconButtonStyle = {
  padding: '0.1rem',
  marginLeft: '0.5rem'
}
export default Header
