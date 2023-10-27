import PropTypes from 'prop-types';
// @mui
import { Typography, Stack } from '@mui/material';
// components
import Logo from '../../components/logo';
import Image from '../../components/image';
//
import { StyledRoot, StyledSectionBg, StyledSection, StyledContent } from './styles';
import { logoSrc } from 'src/data/data';
import { Row } from 'src/components/elements/styled-components';
import styled from 'styled-components';
import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

LoginLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  illustration: PropTypes.string,
};
const TopLogoImg = styled.img`
height: 48px;
cursor:pointer;
@media (max-width:900px){
  height: 32px;
}
`
export default function LoginLayout({ children }) {

  const { themeDnsData } = useSettingsContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (themeDnsData?.id) {
      setLoading(false);
    }
  }, [themeDnsData])
  return (
    <>
      {!loading &&
        <>
          <StyledRoot style={{ flexDirection: 'column' }}>
            <Row style={{ minHeight: '90vh' }}>
              {children}
            </Row>
          </StyledRoot>
        </>}
    </>
  );
}
