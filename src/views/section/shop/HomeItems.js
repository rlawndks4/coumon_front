import styled from 'styled-components'
import { Items, themeObj } from 'src/components/elements/styled-components'
import _ from 'lodash'

const Wrappers = styled.div`
  width:90%;
  max-width:1600px;
  margin:0 auto;
  `

const HomeItems = (props) => {
    const { column, data, func, is_manager } = props;
    const { router } = func;
    const { style } = column;

    return (
        <>
            <Wrappers style={{
                marginTop: `${style?.margin_top}px`,
                display: 'flex',
                flexDirection: `${column?.title ? 'column' : 'row'}`,
            }}>
                {column?.title &&
                    <>
                        <div style={{ fontSize: themeObj.font_size.size3, fontWeight: 'bold' }}>{column?.title}</div>
                        {column?.sub_title &&
                            <>
                                <div style={{ fontSize: themeObj.font_size.size5, color: themeObj.grey[500] }}>{column?.sub_title}</div>
                            </>}
                    </>}
                <div style={{ marginTop: '1rem' }} />
                <Items items={column?.list} router={router} is_slide={column?.list.length >= 4 ? true : false} />
            </Wrappers>
        </>
    )
}
export default HomeItems;