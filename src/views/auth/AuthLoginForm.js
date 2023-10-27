import { useEffect, useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useRouter } from 'next/router';
import { PATH_MANAGER } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  
  const router = useRouter();
  const { login , user} = useAuthContext();
  const defaultValues = {
    user_name: '',
    user_pw: '',
  };
  const [loginData, setLoginData] = useState(defaultValues);
  const [showPassword, setShowPassword] = useState(false);


  const onSubmit = async () => {
    let user = await login(loginData.user_name, loginData.user_pw);
  };

  useEffect(()=>{
    if(user){
      router.push(PATH_MANAGER.dashboards)
    }
  },[user])
  return (
    <>
      <Stack spacing={3}>

        <TextField name="user_name" label="아이디" value={loginData.user_name} onChange={(e) => setLoginData({ ...loginData, user_name: e.target.value })} />

        <TextField
          name="password"
          label="비밀번호"
          type={showPassword ? 'text' : 'password'}
          value={loginData.user_pw}
          onChange={(e) => setLoginData({ ...loginData, user_pw: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyPress={(e) => {
            if (e.key == 'Enter') {
              onSubmit();
            }
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link variant="body2" color="inherit" underline="always">
          Forgot password?
        </Link>
      </Stack>
      <Button
        fullWidth
        size="large"
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
        onClick={onSubmit}
      >
        로그인
      </Button>
    </>

  );
}
