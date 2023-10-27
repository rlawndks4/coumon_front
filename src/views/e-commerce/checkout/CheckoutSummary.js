import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment,
} from '@mui/material';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// components
import Iconify from 'src/components/iconify/Iconify';

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
  onEdit: PropTypes.func,
  total: PropTypes.number,
  discount: PropTypes.number,
  subtotal: PropTypes.number,
  shipping: PropTypes.number,
  enableEdit: PropTypes.bool,
  enableDiscount: PropTypes.bool,
  onApplyDiscount: PropTypes.func,
};

export default function CheckoutSummary({
  total,
  onEdit,
  discount,
  subtotal,
  option_price,
  shipping,
  enableEdit = false,
  enableDiscount = false,
  install_price,
}) {
  const displayShipping = shipping !== null ? 'Free' : '-';

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="주문 요약정보"
        action={
          enableEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="eva:edit-fill" />}>
              Edit
            </Button>
          )
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              총액
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subtotal ?? 0)}원</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              옵션적용가
            </Typography>
            <Typography variant="subtitle2">{fCurrency(option_price)}원</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              배송 및 설치비
            </Typography>
            <Typography variant="subtitle2">{fCurrency(install_price)}원</Typography>
          </Stack>
          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">총 결제 금액</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total ?? 0)}원
              </Typography>
              {/* <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (VAT included if applicable)
              </Typography> */}
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
