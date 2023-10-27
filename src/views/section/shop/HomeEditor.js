import styled from 'styled-components'
import _ from 'lodash'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})
const Wrappers = styled.div`
  width:90%;
  max-width:1600px;
  margin:0 auto;
  `

const HomeEditor = (props) => {
    const { column, data, func, is_manager } = props;
    const { style } = column;
    return (
        <>
            <Wrappers style={{
                marginTop: `${style?.margin_top}px`,
            }}>
                <ReactQuill
                    className='none-padding'
                    value={column?.content ?? `<body></body>`}
                    readOnly={true}
                    theme={"bubble"}
                    bounds={'.app'}
                />
            </Wrappers>
        </>
    )
}
export default HomeEditor;