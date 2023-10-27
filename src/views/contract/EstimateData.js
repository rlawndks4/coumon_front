import ReactPDF, { PDFViewer } from '@react-pdf/renderer';
import { Font, Page, StyleSheet, Document, Text, Image, View, PDFDownloadLink } from '@react-pdf/renderer';
import { Col, Row } from 'src/components/elements/styled-components';
import Logo from 'src/components/logo/Logo';
import { useSettingsContext } from 'src/components/settings';
import { logoSrc } from 'src/data/data';
import { fCurrency } from 'src/utils/formatNumber';
import { commarNumber, returnMoment } from 'src/utils/function';
import styled from 'styled-components';
import jsPDF from "jspdf";
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { calculatorPrice } from 'src/utils/shop-util';

Font.register({ family: 'Noto Sans CJK KR', src: '/fonts/NotoSansKR-Regular.ttf' });

const table_head_list = [
    '제품디자인',
    '모델',
    '사양',
    '수량',
    '단가',
    '금액',
    '비고',
]
const TableCellComponent = styled(TableCell)`
border-right: 1px solid #ccc;
border-bottom: 1px solid #ccc;
align-items:center;
text-align:center;
`
const WaterMarkContainer = styled.div`
position:absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
opacity: 0.5;
z-index:-1;
`
const WaterMark = styled.img`
height: 128px;
width: auto;
opacity: 0.5;
`
const EstimateData = (props) => {
    const { themeDnsData } = useSettingsContext();
    const {
        previewIndex,
        products = [],
        idx,// 0 이상일시 단일, 아닐시 일괄
        style,
        class_name,
        customer,
        dns_data,
        estimate,
    } = props;
    console.log(estimate)
    const styles = StyleSheet.create({
        col: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: 2,
        },
        row: {
            display: 'flex',
            columnGap: 2
        },
        title: {
            fontSize: 20,
            fontFamily: 'Noto Sans CJK KR'
        },
        text: {
            fontSize: 10,
            fontFamily: 'Noto Sans CJK KR',
            letterSpacing: 0
        },
        table_head_cell: {
            padding: '0 0.5rem 1rem 0.5rem',
            letterSpacing: 0
        },
        table_body_cell: {
            padding: '0 0.5rem 1rem 0.5rem',
            letterSpacing: 0
        },
    });
    const renderPdfPage = () => {

        let dnsData = themeDnsData || dns_data;

        return <>
            <Col style={{
                ...style,
                width: '100%',
                position: 'relative',
                minHeight: "761px",
                padding: '0 1rem 0 0',
            }}
            >
                <Row style={{ alignItems: 'center' }}>
                    <img src={logoSrc()} style={{ height: '28px', width: 'auto' }} />
                    <div style={{ ...styles.title, margin: '0 auto', width: '50%' }}>{estimate?.title}</div>
                    <div />
                </Row>
                <Row style={{ ...styles.row, justifyContent: 'space-between', }}>
                    <Row style={styles.col}>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                수신:
                            </div>
                            <div style={styles.text}>
                                {customer?.name}
                            </div>
                        </Row>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                연락처:
                            </div>
                            <div style={styles.text}>
                                {customer?.phone_num}
                            </div>
                        </Row>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                견적일자:
                            </div>
                            <div style={styles.text}>
                                {returnMoment().substring(0, 10)}
                            </div>
                        </Row>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                아래와 같이 견적합니다.
                            </div>
                        </Row>
                        <Row style={{
                            ...styles.row,
                            backgroundColor: themeDnsData?.theme_css?.main_color,
                            padding: `0.4rem 1rem 1rem 1rem`,
                            marginTop: '1rem'
                        }}>
                            <div style={styles.text}>
                                {commarNumber(_.sum(_.map(products, (item) => { return calculatorPrice(item).total })))} 원 (부가세포함가)
                            </div>
                        </Row>
                    </Row>
                    <Row style={{ ...styles.col, alignItems: 'end' }}>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                발신:
                            </div>
                            <div style={styles.text}>
                                {dnsData.name}
                            </div>
                        </Row>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                본사:
                            </div>
                            <div style={styles.text}>
                                {dnsData.addr}
                            </div>
                        </Row>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                발신자:
                            </div>
                            <div style={styles.text}>
                                {dnsData.ceo_name}
                            </div>
                        </Row>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                HP:
                            </div>
                            <div style={styles.text}>
                                {dnsData.phone_num}
                            </div>
                        </Row>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                Tel:
                            </div>
                            <div style={styles.text}>
                                {dnsData.phone_num}
                            </div>
                        </Row>
                        <Row style={styles.row}>
                            <div style={styles.text}>
                                Fax:
                            </div>
                            <div style={styles.text}>
                                {dnsData?.fax_num}
                            </div>
                        </Row>
                    </Row>
                </Row>
                <Table style={{
                    marginTop: '1rem'
                }}
                >
                    <TableHead>
                        <TableRow>
                            {table_head_list.map((text, idx) => (
                                <>
                                    <TableCellComponent sx={styles.table_head_cell} style={{ borderTop: '1px solid #ccc', borderLeft: `${idx == 0 ? '1px solid #ccc' : ''}` }}>{text}</TableCellComponent>
                                </>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ borderLeft: '1px solid #ccc' }}>
                        {products.map((product, index) => {
                            const { select_groups = [], price, count, name, characters = [], } = product;
                            const product_estimate = product?.estimate;
                            if (idx >= 0) {//전체
                                if (index != idx) {
                                    return <>
                                    </>
                                }
                            }
                            return <>
                                <TableRow>
                                    <TableCellComponent sx={styles.table_body_cell}  rowSpan={select_groups?.length + characters?.length + 1}>
                                        <img src={product?.product_img} style={{ width: '150px' }} />
                                    </TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} >상품명</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} >{product?.name}</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell}  rowSpan={select_groups?.length + characters?.length + 1}>{product?.count}</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell}  rowSpan={select_groups?.length + characters?.length + 1}>{commarNumber((calculatorPrice(product).total - calculatorPrice(product).install_price) / product?.count)}</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell}  rowSpan={select_groups?.length + characters?.length + 1}>{commarNumber(calculatorPrice(product).total - calculatorPrice(product).install_price)}</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell}  style={{ maxWidth: '200px' }} rowSpan={select_groups?.length + characters?.length + 1}>{product_estimate?.note}</TableCellComponent>
                                </TableRow>
                                {select_groups && select_groups.map((group, idx) => (
                                    <>
                                        <TableRow>
                                            <TableCellComponent sx={styles.table_body_cell} >{group?.group_name}</TableCellComponent>
                                            <TableCellComponent sx={styles.table_body_cell} >{group?.option_name}</TableCellComponent>
                                        </TableRow>
                                    </>
                                ))}
                                {characters && characters.map((character, idx) => (
                                    <>
                                        <TableRow>
                                            <TableCellComponent sx={styles.table_body_cell} >{character?.character_key}</TableCellComponent>
                                            <TableCellComponent sx={styles.table_body_cell} >{character?.character_value}</TableCellComponent>
                                        </TableRow>
                                    </>
                                ))}
                                <TableRow>
                                    <TableCellComponent sx={styles.table_body_cell}  colSpan={3}>배송 및 설치비</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} >{commarNumber(product_estimate?.install_count)}</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} >{commarNumber(product_estimate?.install_price)}</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} >{commarNumber(product_estimate?.install_price * product_estimate?.install_count)}</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} ></TableCellComponent>
                                </TableRow>
                                <TableRow>
                                    <TableCellComponent sx={styles.table_body_cell}  colSpan={3}>총합계</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} ></TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell}  colSpan={2}>
                                        <Row style={{ justifyContent: 'space-between' }}>
                                            <div>{commarNumber(calculatorPrice(product).total)}</div>
                                            <div>원</div>
                                        </Row>
                                    </TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} ></TableCellComponent>
                                </TableRow>
                            </>
                        })}
                        {!(idx >= 0) &&
                            <>
                                <TableRow>
                                    <TableCellComponent sx={styles.table_body_cell}  colSpan={3} style={{ color: 'red' }}>총합계</TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} ></TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell}  colSpan={2} style={{ color: 'red' }}>
                                        <Row style={{ justifyContent: 'space-between' }}>
                                            <div>{commarNumber(_.sum(products.map((item) => { return calculatorPrice(item).total })))}</div>
                                            <div>원</div>
                                        </Row>
                                    </TableCellComponent>
                                    <TableCellComponent sx={styles.table_body_cell} ></TableCellComponent>
                                </TableRow>
                            </>}
                    </TableBody>
                </Table>
            </Col>
        </>
    }
    return renderPdfPage()
}

export default EstimateData;