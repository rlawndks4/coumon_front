import PropTypes from 'prop-types';
// @mui
import { Box, Stack, Divider, TableRow, TableCell, Typography, IconButton, Tooltip, TextField, TextareaAutosize } from '@mui/material';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// components
import Image from 'src/components/image';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify/Iconify';
import { ColorPreview } from 'src/components/color-utils';
import { IncrementerButton } from 'src/components/custom-input';
import { commarNumber } from 'src/utils/function';
import _ from 'lodash';
import { BlobProvider, pdf, renderToString } from '@react-pdf/renderer';
import { useSettingsContext } from 'src/components/settings';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import { useState } from 'react';
// ----------------------------------------------------------------------

CheckoutCartProduct.propTypes = {
  row: PropTypes.object,
  onDelete: PropTypes.func,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
};

export default function CheckoutCartProduct({ row, customer, onDelete, onDecrease, onIncrease, onClickEstimatePreview, onSavePdf, idx, setProducts, products }) {
  const { themeDnsData, themeCartData, onChangeCartData } = useSettingsContext();
  const { name, size, price, colors, cover, quantity, available, select_groups = [], product_img, count, estimate } = row;
  const [estimateContent, setEstimateContent] = useState(estimate);
  const onChangeProductEstimate = prop => event => {
    let value = event.target.value;
    if (!isNaN(parseFloat(value))) {
      value = parseFloat(value);
    }
    let obj = {
      ...estimateContent,
      [prop]: value
    }
    setEstimateContent(obj)
    let product_list = products;
    product_list[idx]['estimate'] = obj;
    onChangeCartData(product_list);
  }
  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image
          alt="product image"
          src={product_img}
          sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }}
        />

        <Stack spacing={0.5}>
          <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
            {name}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          {select_groups.length > 0 ?
            <>
              {select_groups.map((group, idx) => {
                return <>
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ typography: 'body2', color: 'text.secondary' }}
                  >
                    <div style={{ display: 'flex' }}>
                      {group?.group_name}: {group?.option_name} ({group?.option_price > 0 ? '+' : ''}{commarNumber(group?.option_price)}원)
                    </div>
                  </Stack>
                </>
              })}
            </>
            :
            <>
              ---
            </>}
        </Stack>
      </TableCell>
      <TableCell>
        <Box sx={{ width: 96, textAlign: 'right' }}>
          <IncrementerButton
            quantity={count ?? 1}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabledDecrease={count <= 1}
            disabledIncrease={count >= available}
          />
        </Box>
      </TableCell>
      <TableCell>
        {fCurrency((price + _.sum(select_groups.map((group => { return group?.option_price ?? 0 })))) * count)} 원
      </TableCell>
      <TableCell>
        <Stack spacing={2}>
          <TextField
            sx={{ minWidth: '120px' }}
            size='small'
            label='배송 및 설치비'
            type='number'
            value={estimateContent?.install_price ?? 0}
            onChange={onChangeProductEstimate('install_price')}
          />
          <TextField
            sx={{ minWidth: '120px' }}
            size='small'
            label='배송 및 설치수량'
            type='number'
            value={estimateContent?.install_count ?? 0}
            onChange={onChangeProductEstimate('install_count')}
          />
        </Stack>
      </TableCell>
      <TableCell>
        <TextField
          sx={{ minWidth: '120px' }}
          fullWidth
          label="비고"
          multiline
          rows={3}
          value={estimateContent?.note ?? ""}
          onChange={onChangeProductEstimate('note')}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={onDelete}>
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
