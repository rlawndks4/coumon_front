import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogContent, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Row, Title } from 'src/components/elements/styled-components';
import { test_pay_list, test_address_list, test_item, test_items } from 'src/data/test-data';
import { CheckoutCartProductList, CheckoutSteps, CheckoutSummary } from 'src/views/e-commerce/checkout';
import styled from 'styled-components'
import _ from 'lodash'
import Label from 'src/components/label/Label';
import EmptyContent from 'src/components/empty-content/EmptyContent';
import Iconify from 'src/components/iconify/Iconify';
import { useSettingsContext } from 'src/components/settings';
import { getProductsByUser } from 'src/utils/api-shop';
import { calculatorPrice } from 'src/utils/shop-util';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useModal } from 'src/components/dialog/ModalProvider';
import toast from 'react-hot-toast';
import makePdf from 'src/components/make-pdf';
import EstimateData from 'src/views/contract/EstimateData';
import $ from 'jquery';
import { BlobProvider, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import jsPDF from 'jspdf';
import { Watermark } from '@hirohe/react-watermark';
import { returnMoment } from 'src/utils/function';
const Wrappers = styled.div`
max-width:1500px;
display:flex;
flex-direction:column;
margin: 0 auto;
width: 90%;
min-height:90vh;
margin-bottom:10vh;
`

const STEPS = ['고객정보 작성', '견적서 정보작성', '견적서 출력', '계약서 작성'];


const Demo1 = (props) => {
  const {
    data: {

    },
    func: {
      router
    },
  } = props;
  const { setModal } = useModal()
  const { user } = useAuthContext();
  const estimateRef = useRef([]);
  const estimateBatchRef = useState(null);
  const { themeCartData, onChangeCartData, themeDnsData } = useSettingsContext();
  const [products, setProducts] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [customer, setCustomer] = useState({
    name: '',
    phone_num: '',
  });
  const [estimate, setEstimate] = useState({
    title: '',
  })
  const [openDialog, setOpenDialog] = useState('');
  const [previewIndex, setPreviewIndex] = useState(undefined);
  useEffect(() => {
    getCart();
  }, [themeCartData])

  const getCart = async () => {
    let theme_cart_data = themeCartData;
    let product_list = [];
    for (var i = 0; i < theme_cart_data.length; i++) {
      product_list.push(theme_cart_data[i]);
    }
    setProducts(product_list);
  }

  const onDelete = (idx) => {
    let product_list = [...products];
    product_list.splice(idx, 1);
    onChangeCartData(product_list);
    setProducts(product_list);
  }
  const onDecreaseQuantity = (idx) => {
    let product_list = [...products];
    product_list[idx].count = (product_list[idx]?.count ?? 1) - 1;
    setProducts(product_list);
    onChangeCartData(product_list);
  }
  const onIncreaseQuantity = (idx) => {
    let product_list = [...products];
    product_list[idx].count = (product_list[idx]?.count ?? 1) + 1;
    setProducts(product_list);
    onChangeCartData(product_list);
  }
  const onClickNextStep = () => {

    if (activeStep == 2 && !router.query?.id) {
      setModal({
        func: () => { onClickReflectEstimate(); },
        icon: 'carbon:next-outline',
        title: '다음단계로 넘어가시겠습니까?',
        sub_title: '해당 견적이 관리자 페이지에 반영됩니다.',
      })
      return;
    }
    setActiveStep(activeStep + 1);
    scrollTo(0, 0)
  }
 
  const onClickPrevStep = () => {
    setActiveStep(activeStep - 1);
    scrollTo(0, 0)
  }

  const onClickReflectEstimate = () => {
    setActiveStep(activeStep + 1);
  }
  const onClickEstimatePreview = (idx) => {
    setPreviewIndex(idx);
    setOpenDialog('estimate')
    if (idx == -1) {//여러개 미리보기

    } else {

    }
  }

  const onSavePdf = async (idx) => {
    let doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'letter',
      putOnlyUsedFonts: true,
      compress: true
    });

    doc.addFont('/fonts/NotoSansKR-Regular.ttf', 'Noto Sans CJK KR', 'normal');
    doc.setFont('Noto Sans CJK KR');
    let html = undefined;

    if (idx >= 0) {
      html = estimateRef.current[idx];
    } else {
      html = estimateBatchRef.current;
    }

    await doc.html(html, {
      width: 580,
      windowWidth: 580,
      margin: 15,
    });
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // 모바일인 경우
      doc.save(`${user?.name}견적서${returnMoment().replaceAll(' ', '').replaceAll('-', '').replaceAll(':', '')}`)
    } else {
      doc.output('dataurlnewwindow');
    }
  }
  return (
    <>
      <Dialog
        open={true}
        className='estimate_container'
        onClose={() => {
          setOpenDialog('');
        }}
        sx={{
          display: `${openDialog == 'estimate' ? '' : 'none'}`,
          margin: '2rem',
        }}
        PaperProps={{
          style: {
            width: '420px'
          }
        }}
      >
        <Row>
          <IconButton style={{ margin: '0.5rem 0.5rem 0.5rem auto' }}
            onClick={() => {
              setOpenDialog('');
            }}>
            <Iconify icon={'material-symbols:close'} />
          </IconButton>
        </Row>
      </Dialog>
      {products.map((product, index) => {
        return <div style={{ position: 'absolute', top: '-9999px', display: 'none' }}>
          <div
            style={{
              width: '598px',
            }}
            ref={(element) => {
              estimateRef.current[index] = element;
            }}>
            <EstimateData products={products} idx={index} customer={customer} dns_data={themeDnsData} estimate={estimate} />
          </div>
        </div>
      })}
      <div style={{ position: 'absolute', top: '-9999px', display: 'none' }}>
        <div
          style={{
            width: '598px',
          }}
          ref={estimateBatchRef}>
          <EstimateData products={products} customer={customer} dns_data={themeDnsData} estimate={estimate} />
        </div>
      </div>
      <Wrappers>
        <Title>새 계약 생성</Title>
        <CheckoutSteps activeStep={activeStep} steps={STEPS} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Row style={{ width: '100%', justifyContent: 'space-between', marginBottom: '1rem' }}>
              {activeStep != 0 ?
                <>
                  <Button startIcon={<Iconify icon="grommet-icons:form-previous" />} onClick={onClickPrevStep} variant="soft" size="small">
                    이전 단계 돌아가기
                  </Button>
                </>
                :
                <>
                  <div />
                </>}
              {activeStep != STEPS.length - 1 ?
                <>
                  <Button
                    size="small"
                    variant="soft"
                    onClick={onClickNextStep}
                    endIcon={<Iconify icon="grommet-icons:form-next" />}
                  >
                    다음 단계 넘어가기
                  </Button>
                </>
                :
                <>
                  <div />
                </>}
            </Row>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            {activeStep == 0 &&
              <>
                <Card>
                  <CardHeader title="고객정보입력" />
                  <CardContent>
                    <Stack spacing={3} sx={{ width: 1 }}>
                      <TextField
                        label='고객명'
                        value={customer.name}
                        onChange={(e) => {
                          setCustomer(
                            {
                              ...customer,
                              ['name']: e.target.value
                            }
                          )
                        }} />
                      <TextField
                        label='고객연락처'
                        value={customer.phone_num}
                        onChange={(e) => {
                          setCustomer(
                            {
                              ...customer,
                              ['phone_num']: e.target.value
                            }
                          )
                        }} />
                    </Stack>
                  </CardContent>
                </Card>
              </>}
            {activeStep == 1 &&
              <>
                <Card>
                  <CardHeader title="견적서 기본정보입력" />
                  <CardContent>
                    <Stack spacing={3} sx={{ width: 1 }}>
                      <TextField
                        label='견적서제목'
                        value={estimate.title}
                        onChange={(e) => {
                          setEstimate(
                            {
                              ...estimate,
                              ['title']: e.target.value
                            }
                          )
                        }} />
                    </Stack>
                  </CardContent>
                </Card>
              </>}
            {activeStep == 2 &&
              <>
                <Card>
                  {products.length > 0 ?
                    <>
                      <CheckoutCartProductList
                        products={products}
                        setProducts={setProducts}
                        onDelete={onDelete}
                        onDecreaseQuantity={onDecreaseQuantity}
                        onIncreaseQuantity={onIncreaseQuantity}
                        onClickEstimatePreview={onClickEstimatePreview}
                        customer={customer}
                        onSavePdf={onSavePdf}
                      />
                    </>
                    :
                    <>
                      <EmptyContent
                        title="상품 리스트가 비어 있습니다."
                        description="상품 > 상품추가 버튼을 이용해 상품을 추가해 주세요."
                        img="/assets/illustrations/illustration_empty_cart.svg"
                      />
                    </>}
                </Card>
              </>}
            {activeStep == 3 &&
              <>
                <Card sx={{ marginBottom: '1.5rem' }}>
                  <CardHeader title="결제 수단 선택" />
                  <CardContent>

                  </CardContent>
                </Card>
              </>}
          </Grid>
          <Grid item xs={12} md={3}>
            <CheckoutSummary
              enableDiscount
              total={_.sum(products.map((item) => { return calculatorPrice(item).total }))}
              option_price={_.sum(products.map((item) => { return calculatorPrice(item).option_price }))}
              subtotal={_.sum(products.map((item) => { return calculatorPrice(item).subtotal }))}
              install_price={_.sum(products.map((item) => { return calculatorPrice(item).install_price }))}
            />
            <Button
              fullWidth
              disabled={!(activeStep == 2)}
              size="large"
              variant="contained"
              startIcon={<Iconify icon="bi:file-pdf" />}
              onClick={async () => {
                onSavePdf(-1);
              }}
              sx={{ whiteSpace: 'nowrap', marginBottom: '1rem' }}

            >
              견적서 출력
            </Button>
          </Grid>
        </Grid>


      </Wrappers>
    </>
  )
}

export default Demo1
