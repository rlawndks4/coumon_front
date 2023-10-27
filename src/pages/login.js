import { Stack, TextField, InputAdornment, IconButton, Card, CardContent, Link, Typography } from '@mui/material';
import LoginLayout from 'src/layouts/login/LoginLayout';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify/Iconify';
import $ from 'jquery';
import { useRouter } from 'next/router';
import { logoSrc } from 'src/data/data';
import { useSettingsContext } from 'src/components/settings';
import NextLink from 'next/link';
import { StyledContent, StyledSection, StyledSectionBg } from 'src/layouts/login/styles';
import Image from 'src/components/image/Image';
import dynamic from 'next/dynamic';
import { PATH_MANAGER } from 'src/routes/paths';
const Tour = dynamic(
  () => import('reactour'),
  { ssr: false },
);
const Login = () => {
  const { login, user } = useAuthContext();
  const { themeDnsData } = useSettingsContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (user?.level >= 10) {
      router.push(PATH_MANAGER.dashboards);
    }
    setLoading(false);
  }, [user])
  useEffect(() => {
    if (router.query?.is_first && !user) {
      openTour('is-first', "판매자 계정이 없으시면 클릭 후 가입해 주세요.\n5분 내에 가입이 완료됩니다 !")
    }
  }, [router.query?.is_first])
  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = async () => {
    let user = await login(username, password);
    if (user) {
      router.push(PATH_MANAGER.dashboards)
    }
  };
  const [tourOpen, setTourOpen] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);

  const openTour = (class_name, text,) => {
    setTourSteps([
      {
        selector: `.${class_name}`,
        content: text,
      },
    ])
    setTourOpen(true);
  }
  const closeTour = () => {
    setTourOpen(false);
    setTourSteps([]);
  };
  return (
    <>
      <StyledSection>
        <Typography variant="h3" sx={{ mb: 10, maxWidth: 520, textAlign: 'center' }}>
          {themeDnsData?.name} 에 오신것을 환영합니다!
        </Typography>
        <Image
          disabledEffect
          visibleByDefault
          alt="auth"
          src={'/assets/illustrations/illustration_dashboard.png'}
          sx={{ maxWidth: 720 }}
        />
        <StyledSectionBg />
      </StyledSection>
      <StyledContent style={{ minHeight: '90vh' }}>
        <Stack sx={{ width: 1 }}>
          <img src={logoSrc()} style={{ maxWidth: '200px', margin: '1rem auto' }} />
          <Stack spacing={3}>
            <TextField
              name="username"
              label="아이디를 입력해 주세요."
              autoComplete='new-password'
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              onKeyPress={(e) => {
                if (e.key == 'Enter') {
                  $('#id').focus();
                }
              }}
            />
            <TextField
              name="password"
              id="password"
              label="패스워드를 입력해 주세요."
              type={showPassword ? 'text' : 'password'}
              autoComplete='new-password'
              onKeyPress={(e) => {
                if (e.key == 'Enter') {
                  onSubmit();
                }
              }}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            sx={{
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
              '&:hover': {
                bgcolor: 'text.primary',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
              },
              margin: '24px 0'
            }}
            onClick={onSubmit}
          >
            로그인
          </LoadingButton>
        </Stack>
      </StyledContent>
      <Tour
        steps={tourSteps}
        isOpen={tourOpen}
        disableInteraction={false}
        onRequestClose={closeTour} />
    </>
  );
}
Login.getLayout = (page) => <LoginLayout>{page}</LoginLayout>;
export default Login;
