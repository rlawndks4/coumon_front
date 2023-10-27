// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import { Icon } from '@iconify/react'
import { InputAdornment, TextField } from '@mui/material'
import styled from 'styled-components'
import { themeObj } from '../elements/styled-components'
import { useRouter } from 'next/router'

const Title = styled.div`
font-size: 0.9rem;
padding: 0 0 1rem 0;
`
const Content = styled.div`
display:flex;
padding:0.5rem 0;
font-size: 0.9rem;
cursor:pointer;
margin-left:0.5rem;
font-weight:bold;
`
const testSearchList = [
  { title: '블랙시크릿콤보' },
  { title: '방콕점보윙' },
  { title: '레블' },
  { title: '반반오리지날' },
  { title: '국물역떡' },
  { title: '오리지날' },
]
const DialogSearch = (props) => {
  // ** State
  const { open, handleClose, onKeepGoing, style, root_path } = props;

  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  return (
    <Dialog fullScreen onClose={handleClose} open={open} PaperProps={{
      style: {
        margin: '0'
      }
    }}>
      <DialogTitle id='full-screen-dialog-title' style={{ paddingBottom: '2rem' }}>
        <Typography variant='h6' component='span'>
          <div style={{ display: 'flex' }}>
            <TextField
              label='통합검색'
              id='size-small'
              size='small'
              onChange={(e) => {
                setKeyword(e.target.value)
              }}
              value={keyword}
              sx={{ width: '80%', margin: '0 auto', maxWidth: '700px' }}
              onKeyPress={(e) => {
                if (e.key == 'Enter') {
                  router.push(`/${root_path}/search?keyword=${keyword}`)
                  handleClose();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => {
                        router.push(`/${root_path}/search?keyword=${keyword}`)
                        handleClose();
                      }}
                      aria-label='toggle password visibility'
                    >
                      <Icon icon={'tabler:search'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
        </Typography>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{ top: 18, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='tabler:x' />
        </IconButton>
      </DialogTitle>
      <div style={{ borderTop: `1px solid ${themeObj.grey[300]}` }} />
      <DialogContent style={{ maxWidth: '750px', margin: '1rem auto', width: '80%' }}>
        <Title>인기 검색어</Title>
        {testSearchList.map((item, idx) => (
          <>
            <Content>
              <div style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{idx + 1}</div>
              <div>{item.title}</div>
            </Content>
          </>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default DialogSearch
