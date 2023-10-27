import styled from 'styled-components'
import { Items, Row, themeObj } from 'src/components/elements/styled-components'
import { Button, Tab } from '@mui/material'
import _ from 'lodash'
import { styled as muiStyled } from '@mui/material/styles';
import { useState } from 'react'
const Wrappers = styled.div`
  width:90%;
  max-width:1600px;
  margin:0 auto;
  flex-direction: ${props => props.is_vertical == 1 ? 'row' : 'column'};
  @media (max-width:1000px) {
    flex-direction:column;
  }  
`
const HeaderContainer = styled.div`
display:flex;
align-items: ${props => props.is_vertical == 1 ? 'flex-start' : 'center'};
flex-direction: ${props => props.is_vertical == 1 ? 'column' : 'row'};
min-width: ${props => props.is_vertical == 1 ? '250px' : ''};
flex-wrap:wrap;
column-gap:0.5rem;
row-gap:0.5rem;
@media (max-width:1000px) {
    align-items: center;
    flex-direction:row;
    width:auto;
}  
`
const TabContainer = styled.div`
display:flex;
margin-left: ${props => props.is_vertical == 1 ? '0' : 'auto'};
margin-top: ${props => props.is_vertical == 1 ? '1rem' : '0'};
column-gap: 0.5rem;
row-gap: 0.5rem;
overflow-x: auto;
white-space: nowrap;
flex-direction: ${props => props.is_vertical == 1 ? 'column' : 'row'};
@media (max-width:1000px) {
    flex-direction:row;
    margin-left: auto;
}
`
const NoneShowMobile = styled.div`

`
const CategoryTabs = (props) => {
    const {
        column,
        itemCategory,
        onClickItemCategory,
        idx
    } = props;
    return (
        <>
            <TabContainer is_vertical={column?.is_vertical}>
                {column?.list && column?.list.map((item, index) => (
                    <>
                        <Button variant={itemCategory == index ? `contained` : `outlined`} sx={{ height: '36px', minWidth: `${(column?.is_vertical == 1 && window.innerWidth > 1000 ? '220px' : '')}` }} onClick={() => {
                            onClickItemCategory(index);
                        }}>
                            {item?.category_name}
                        </Button>
                    </>
                ))}
            </TabContainer>
        </>
    )
}
const HomeItemsWithCategories = (props) => {
    const { column, data, func, is_manager } = props;
    let { idx } = data;
    const { router } = func;
    const { style } = column;
    const [itemCategory, setItemCategory] = useState(0);
    const onClickItemCategory = (index) => {
        setItemCategory(index)
    }
    return (
        <>
            <Wrappers style={{
                marginTop: `${style?.margin_top}px`,
                display: 'flex',
            }}
                is_vertical={column?.is_vertical}
            >
                <HeaderContainer is_vertical={column?.is_vertical}>
                    <Row style={{ flexDirection: 'column', }}>
                        {column?.title &&
                            <>
                                <div style={{ fontSize: themeObj.font_size.size3, fontWeight: 'bold' }}>{column?.title}</div>
                                {column?.sub_title &&
                                    <>
                                        <div style={{ fontSize: themeObj.font_size.size5, color: themeObj.grey[500] }}>{column?.sub_title}</div>
                                    </>}
                            </>}
                    </Row>
                    <CategoryTabs onClickItemCategory={onClickItemCategory} column={column} itemCategory={itemCategory} idx={idx} />
                </HeaderContainer>
                <div style={{ marginTop: '1rem' }} />
                <Row>
                    {column?.list && column?.list.map((item, index) => (
                        <>
                            {itemCategory == index &&
                                <>
                                    <Items items={item?.list} router={router} />
                                </>}
                        </>
                    ))}
                </Row>
            </Wrappers>
        </>
    )
}
export default HomeItemsWithCategories;