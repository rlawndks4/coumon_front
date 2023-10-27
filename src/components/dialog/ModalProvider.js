import { Icon } from '@iconify/react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Row } from '../elements/styled-components'

const ModalContext = React.createContext()

const Modal = ({ modal, unSetModal }) => {
  useEffect(() => {
    const bind = e => {
      if (e.keyCode !== 27) {
        return
      }
      if (document.activeElement && ['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
        return
      }
      unSetModal()
    }
    document.addEventListener('keyup', bind)
    return () => document.removeEventListener('keyup', bind)

  }, [modal, unSetModal])

  return (
    <Dialog
      onClose={() => unSetModal()}
      open={true}
      sx={{
      }}
      PaperProps={{
        sx: {
          minWidth: '300px'
        }
      }}
    >
      {modal?.icon &&
        <>
          <Row>
            <Icon icon={modal?.icon} style={{
              margin: '1rem auto 0 auto',
              fontSize: '3rem'
            }} />
          </Row>
        </>}
      <DialogTitle sx={{ margin: '0 auto' }}>{modal?.title}</DialogTitle>
      {modal?.sub_title &&
        <>
          <DialogTitle sx={{ margin: '0 auto', paddingTop: '0' }} variant='body2'>{modal?.sub_title}</DialogTitle>
        </>}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ margin: '0 auto' }}>
        <Button variant='contained' onClick={() => {
          modal?.func()
          unSetModal()
        }}>확인</Button>
        <Button variant='outlined' onClick={() => unSetModal()}>취소</Button>
      </DialogActions>
    </Dialog>
  )
}

const ModalProvider = props => {
  const [modal, setModal] = useState()
  const unSetModal = useCallback(() => {
    setModal()
  }, [setModal])

  return (
    <ModalContext.Provider value={{ unSetModal, setModal }} {...props} >
      {props.children}
      {modal && <Modal modal={modal} unSetModal={unSetModal} />}
    </ModalContext.Provider>
  )
}

const useModal = () => {
  const context = React.useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a UserProvider')
  }
  return context
}

export { ModalProvider, useModal }
