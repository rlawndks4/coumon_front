import { Card, Chip, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import ManagerTable from "src/views/manager/table/ManagerTable";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

import { useModal } from "src/components/dialog/ModalProvider";
import ManagerLayout from "src/layouts/manager/ManagerLayout";
import { apiManager } from "src/utils/api-manager";
import { useAuthContext } from "src/auth/useAuthContext";
import { Row } from "src/components/elements/styled-components";
const LogList = () => {
  const { setModal } = useModal()
  const { user } = useAuthContext();
  const defaultColumns = [
    {
      id: 'user_id',
      label: '회원No.',
      action: (row) => {
        return row['user_id'] ?? "---"
      }
    },
    {
      id: 'user_name',
      label: '회원아이디',
      action: (row) => {
        return row['user_name'] ?? "---"
      }
    },
    {
      id: 'result',
      label: 'RESULT',
      action: (row) => {

        return <>
          <Chip label={row['response_result'] ?? "---"} color={row['response_result'] > 0 ? 'secondary' : 'error'} />
        </>
      }
    },
    {
      id: 'method',
      label: 'METHOD',
      action: (row) => {
        let request = JSON.parse(row['request']);
        return request['method'] ?? "---"
      }
    },
    {
      id: 'url',
      label: 'URL',
      action: (row) => {
        let request = JSON.parse(row['request']);
        return request['url'] ?? "---"
      }
    },
    {
      id: 'request_data',
      label: 'REQUEST DATA',
      action: (row) => {
        let request = JSON.parse(row['request']);
        let tooltip = <>
          <div>{`query: ${JSON.stringify(request?.query)}`}</div>
          <div>{`params: ${JSON.stringify(request?.params)}`}</div>
          <div>{`body: ${JSON.stringify(request?.body)}`}</div>
        </>;
        return <>
          <Tooltip title={tooltip}>
            <IconButton>
              <Icon icon={'charm:info'} />
            </IconButton>
          </Tooltip>
        </>
      }
    },
    {
      id: 'response_message',
      label: 'RESULT MESSAGE',
      action: (row) => {
        return row['response_message'] ?? "---"
      }
    },
    {
      id: 'response_data',
      label: 'RESULT DATA',
      action: (row) => {
        return <>
          <Tooltip title={row?.response_data}>
            <IconButton>
              <Icon icon={'charm:info'} />
            </IconButton>
          </Tooltip>
        </>
      }
    },
    {
      id: 'ip',
      label: 'IP',
      action: (row) => {
        return row['request_ip'] ?? "---"
      }
    },
    {
      id: 'created_at',
      label: '생성시간',
      action: (row) => {
        return row['created_at'] ?? "---"
      }
    },
    {
      id: 'edit',
      label: `삭제`,
      action: (row) => {
        return (
          <>
            {user?.level >= 50 &&
              <>
                <IconButton onClick={() => {
                  setModal({
                    func: () => { deleteLog(row?.id) },
                    icon: 'material-symbols:delete-outline',
                    title: '정말 삭제하시겠습니까?'
                  })
                }}>
                  <Icon icon='material-symbols:delete-outline' />
                </IconButton>
              </>}

          </>
        )
      }
    },
  ]
  const router = useRouter();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState({});
  const [searchObj, setSearchObj] = useState({
    page: 1,
    page_size: 10,
    s_dt: '',
    e_dt: '',
    search: '',

  })
  useEffect(() => {
    pageSetting();
  }, [])
  const pageSetting = () => {
    let cols = defaultColumns;
    setColumns(cols)
    onChangePage({ ...searchObj, page: 1, });
  }
  const onChangePage = async (obj) => {
    setData({
      ...data,
      content: undefined
    })
    let data_ = await apiManager('logs', 'list', obj);
    if (data_) {
      setData(data_);
    }
    setSearchObj(obj);
  }
  const deleteLog = async (id) => {
    let data = await apiManager('logs', 'delete', { id });
    if (data) {
      onChangePage(searchObj);
    }
  }
  return (
    <>
      <Stack spacing={3}>
        <Card>
          <Row style={{ padding: '12px', columnGap: '0.5rem' }}>
            <FormControl
              size="small"
            >
              <InputLabel>result 타입</InputLabel>
              <Select
                style={{ flexGrow: 1, width: '240px' }}
                label='result 타입'
                value={searchObj?.response_result_type}
                onChange={(e) => {
                  onChangePage({ ...searchObj, response_result_type: e.target.value })
                }}>
                <MenuItem value={null}>{'전체'}</MenuItem>
                <MenuItem value={1}>{'성공'} ({data?.success && (data?.success[0]?.success ?? 0)})</MenuItem>
                <MenuItem value={2}>{'실패'} ({data?.fail && (data?.fail[0]?.fail ?? 0)})</MenuItem>
              </Select>
            </FormControl>
          </Row>
          <Divider />
          <ManagerTable
            data={data}
            columns={columns}
            searchObj={searchObj}
            onChangePage={onChangePage}
            add_button_text={''}
          />
        </Card>
      </Stack>
    </>
  )
}
LogList.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default LogList
