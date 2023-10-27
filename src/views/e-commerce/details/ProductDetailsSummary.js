import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { sentenceCase } from 'change-case';
// next
import { useRouter } from 'next/router';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import {
  Box,
  Link,
  Stack,
  Button,
  Rating,
  Divider,
  MenuItem,
  Typography,
  IconButton,
  Select,
  Chip,
} from '@mui/material';
// routes
// utils
import { fCurrency } from 'src/utils/formatNumber';
// _mock
// components
import Iconify from 'src/components/iconify/Iconify';
import { commarNumber } from 'src/utils/function';
import { themeObj } from 'src/components/elements/styled-components';
import { useSettingsContext } from 'src/components/settings';
import _ from 'lodash';
import { test_pay_list } from 'src/data/test-data';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useModal } from "src/components/dialog/ModalProvider";
import { selectItemOptionUtil } from 'src/utils/shop-util';
import { product_status_list } from 'src/data/status-data';
import toast from 'react-hot-toast';
import { IncrementerButton } from 'src/components/custom-input';
// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  product: PropTypes.object,
  onGotoStep: PropTypes.func,
};
const STEPS = ['배송지 확인', '결제하기'];
export default function ProductDetailsSummary({ product, onGotoStep, onAddCart, ...other }) {
  const { setModal } = useModal()
  const { themeCartData, onChangeCartData, themeDnsData } = useSettingsContext();
  const { user } = useAuthContext();
  const [addressList, setAddressList] = useState([]);
  const [selectAddress, setSelectAddress] = useState({});
  const [payList, setPayList] = useState([]);
  const [selectProduct, setSelectProduct] = useState({ id: product?.id, count: 1, select_option_obj: {} });
  const [payData, setPayData] = useState({
    brand_id: themeDnsData?.id,
    user_id: user?.id ?? undefined,
    product_id: product?.id,
    amount: product?.product_sale_price ?? 0,
    item_name: product?.product_name,
    buyer_name: user?.nick_name ?? "",
    installment: 0,
    buyer_phone: '',
    card_num: '',
    yymm: '',
    auth_num: '',
    card_pw: '',
    addr: "",
    detail_addr: '',
    temp: [],
    password: ""
  })
  const [count, setCount] = useState(1);
  const [selectGroups, setSelectGroups] = useState([]);
  const cart = []

  const {
    id,
    name,
    sub_name,
    product_sale_price = 0,
    product_price = 0,
    price,
    status,
    groups = [],
    characters = [],
  } = product;
  useEffect(() => {
    let pay_list = test_pay_list;
    setPayList(pay_list)
  }, [])

  const onSelectOption = (group, option) => {
    let is_exist_option_idx = _.findIndex(selectGroups, { group_id: parseInt(group?.id) });
    let select_groups = selectGroups;
    if (is_exist_option_idx >= 0) {
      select_groups[is_exist_option_idx].group_id = group?.id;
      select_groups[is_exist_option_idx].group_name = group?.name;
      select_groups[is_exist_option_idx].option_id = option?.id;
      select_groups[is_exist_option_idx].option_name = option?.name;
      select_groups[is_exist_option_idx].option_price = option?.price;
    } else {
      select_groups.push({
        group_id: group?.id,
        group_name: group?.name,
        option_id: option?.id,
        option_name: option?.name,
        option_price: option?.price,
      })
    }
    select_groups.sort(function (a, b) {
      return a.group_id - b.group_id || a.option_id - b.option_id;
    });
    setSelectGroups(select_groups);
  }
  console.log(characters)
  return (
    <>
      <form>
        <Stack
          spacing={3}
          sx={{
            p: (theme) => ({
              md: theme.spacing(5, 5, 0, 2),
            }),
          }}
          {...other}
        >
          <Stack spacing={2}>
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: status === 'sale' ? 'error.main' : 'info.main',
              }}
            >
              <Chip label={product_status_list[status].title} variant="soft" color={product_status_list[status].chip_color} />
            </Typography>

            <Typography variant="h5">{name}</Typography>
            <Typography variant="h7" color={themeObj.grey[500]}>{sub_name}</Typography>
            {characters.map((character, idx) => (
              <>
                <Typography variant="h8" color={themeObj.grey[600]} sx={{fontSize:'0.8rem'}}>{character?.character_key}: {character?.character_value}</Typography>
              </>
            ))}
            <Typography variant="h4">
              {product_price > product_sale_price && (
                <Box
                  component="span"
                  sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
                >
                  {fCurrency(product_price)}
                </Box>
              )}
              {commarNumber(price)} 원
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />
          {groups.map((group) => (
            <>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ height: 40, lineHeight: '40px', flexGrow: 1 }}>
                  {group?.group_name}
                </Typography>
                <Select
                  name="size"
                  size="small"
                  sx={{
                    minWidth: 96,
                    '& .MuiFormHelperText-root': {
                      mx: 0,
                      mt: 1,
                      textAlign: 'right',
                    },
                  }}
                  onChange={(e) => {
                    onSelectOption(group, e.target.value)
                  }}
                >
                  {group?.options && group?.options.map((option) => (
                    <MenuItem key={option?.option_name} value={option}>
                      {option?.option_name} ({option?.option_price >= 0 ? `+` : ``}{commarNumber(option?.option_price)}원)
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </>
          ))}
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" sx={{ height: 36, lineHeight: '36px' }}>
              수량
            </Typography>

            <Stack spacing={1}>
              <IncrementerButton
                name="quantity"
                quantity={count}
                disabledDecrease={count <= 1}
                disabledIncrease={count >= 100}
                onIncrease={() => {
                  setCount(count + 1);
                }}
                onDecrease={() => {
                  setCount(count - 1);
                }}
              />
            </Stack>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              disabled={!(status == 0)}
              size="large"
              color="warning"
              variant="contained"
              startIcon={<Iconify icon="ic:round-add-shopping-cart" />}
              onClick={() => {
                setModal({
                  func: () => { onAddCart(selectGroups, count) },
                  icon: 'ic:round-add-shopping-cart',
                  title: '상품을 담으시겠습니까?'
                })
              }}
              sx={{ whiteSpace: 'nowrap' }}

            >
              상품담기
            </Button>
            <Button
              fullWidth
              size="large"
              disabled={!(status == 0)}
              variant="contained" onClick={() => {

              }}>
              계약서작성
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
}
