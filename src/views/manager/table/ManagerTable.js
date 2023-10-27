// @mui
import { Table, TableRow, TableBody, TableCell, TableContainer, Pagination, Divider, Box, TextField, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, CircularProgress, Tooltip } from '@mui/material';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import {
  DatePicker,
  StaticDatePicker,
  MobileDatePicker,
  DesktopDatePicker,
} from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import { Row } from 'src/components/elements/styled-components';
import styled from 'styled-components';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import { styled as muiStyled } from '@mui/material';
import { useTheme } from '@emotion/react';
import { returnMoment } from 'src/utils/function';
import { Spinner } from 'evergreen-ui';
// ----------------------------------------------------------------------
const TableHeaderContainer = styled.div`
padding: 0.75rem;
display: flex;
flex-wrap: wrap;
justify-content:space-between;
@media (max-width:1000px){
  flex-direction:column;
  row-gap:0.75rem;
}
`
const CustomTableRow = muiStyled(TableRow)(({ theme }) => ({
  '&:hover': {
    background: `${theme.palette.mode == 'dark' ? '' : theme.palette.grey[100]}`,
  },
}));

export default function ManagerTable(props) {
  const { columns, data, add_button_text, add_link, onChangePage, searchObj } = props;
  const { page, page_size } = props?.searchObj;

  const theme = useTheme();
  const router = useRouter();
  const [sDt, setSDt] = useState(undefined);
  const [eDt, setEDt] = useState(undefined);
  const [keyword, setKeyWord] = useState("");

  const getMaxPage = (total, page_size) => {
    if (total == 0) {
      return 1;
    }
    if (total % page_size == 0) {
      return parseInt(total / page_size);
    } else {
      return parseInt(total / page_size) + 1;
    }
  }
  return (
    <>
      <TableContainer sx={{ overflow: 'unset' }}>
        <TableHeaderContainer>
          <Row>
            {window.innerWidth > 1000 ?
              <>
                <DesktopDatePicker
                  label="시작일 선택"
                  value={sDt}
                  format='yyyy-MM-dd'
                  onChange={(newValue) => {
                    setSDt(newValue);
                    onChangePage({ ...searchObj, s_dt: returnMoment(false, new Date(newValue)).substring(0, 10), page: 1 })
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                  sx={{ marginRight: '0.75rem', width: '180px', height: '32px' }}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <DesktopDatePicker
                  label="종료일 선택"
                  value={eDt}
                  format='yyyy-MM-dd'
                  onChange={(newValue) => {
                    setEDt(newValue);
                    onChangePage({ ...searchObj, e_dt: returnMoment(false, new Date(newValue)).substring(0, 10), page: 1 })
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                  sx={{ width: '180px' }}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </>
              :
              <>
                <MobileDatePicker
                  label="시작일 선택"
                  value={sDt}
                  format='yyyy-MM-dd'
                  onChange={(newValue) => {
                    setSDt(newValue);
                    onChangePage({ ...searchObj, s_dt: returnMoment(false, new Date(newValue)).substring(0, 10), page: 1 })
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                  sx={{ marginRight: '0.75rem', flexGrow: 1 }}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <MobileDatePicker
                  label="종료일 선택"
                  value={eDt}
                  format='yyyy-MM-dd'
                  onChange={(newValue) => {
                    setEDt(newValue);
                    onChangePage({ ...searchObj, e_dt: returnMoment(false, new Date(newValue)).substring(0, 10), page: 1 })
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                  sx={{ flexGrow: 1 }}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </>}
          </Row>
          <Row>
            <FormControl variant="outlined">
              <OutlinedInput
                size='small'
                label=''
                value={keyword}
                endAdornment={<>
                  <Tooltip title='해당 텍스트로 검색하시려면 엔터 또는 돋보기 버튼을 클릭해주세요.'>
                    <IconButton position="end" sx={{ transform: 'translateX(14px)' }} onClick={() => onChangePage({ ...searchObj, search: keyword })}>
                      <Icon icon='material-symbols:search' />
                    </IconButton>
                  </Tooltip>

                </>}
                onChange={(e) => {
                  setKeyWord(e.target.value)
                }}
                onKeyPress={(e) => {
                  if (e.key == 'Enter') {
                    onChangePage({ ...searchObj, search: keyword })
                  }
                }}
              />
            </FormControl>
            {add_button_text ?
              <>
                <Button variant='contained' sx={{ marginLeft: '0.75rem' }} onClick={() => {
                  let path = router.asPath;
                  if (router.asPath.includes('list')) {
                    path = path.replace('list', '');
                  }
                  router.push(add_link || `${path}add`)
                }}>
                  + {add_button_text}
                </Button>
              </>
              :
              <>
              </>}
          </Row>
        </TableHeaderContainer>
        <div style={{ width: '100%', overflow: 'auto' }}>
          {!data.content ?
            <>
              <Row style={{ height: '400px' }}>
                <CircularProgress sx={{ margin: 'auto' }} />
              </Row>
            </>
            :
            <>
              <Table sx={{ minWidth: 800, overflowX: 'auto' }}>
                <TableHeadCustom headLabel={columns} />
                <TableBody>
                  {data.content && data.content.map((row, index) => (
                    <CustomTableRow key={index}>
                      {columns && columns.map((col, idx) => (
                        <>
                          <TableCell align="left" sx={{ ...(col?.sx ? col.sx(row) : {}) }}>{col.action(row, idx)}</TableCell>
                        </>
                      ))}
                    </CustomTableRow>
                  ))}
                </TableBody>
                {data.content && data.content.length == 0 &&
                  <>
                    <TableNoData isNotFound={true} />
                  </>}
              </Table>
            </>}
        </div>
        <Divider />
        <Box sx={{ padding: '0.75rem', display: 'flex' }}>
          <Pagination
            sx={{ marginLeft: 'auto' }}
            size={'medium'}
            count={getMaxPage(data?.total, data?.page_size)}
            page={page}
            variant='outlined' shape='rounded'
            color='primary'
            onChange={(_, num) => {
              onChangePage({
                ...searchObj,
                page: num
              })
            }} />
        </Box>
      </TableContainer>
    </>

  );
}
