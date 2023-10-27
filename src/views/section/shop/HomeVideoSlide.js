import { Icon } from '@iconify/react'
import Slider from 'react-slick'
import styled from 'styled-components'
import { Row, themeObj } from 'src/components/elements/styled-components'
import _ from 'lodash'

const FullWrappers = styled.div`
  width:100%;
  `

const NextArrowStyle = styled.div`
  position: absolute;
    top: 15vw;
    right: 12px;
    z-index: 2;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    font-size: 28px;
    border-radius: 50%;
    background: #aaaaaa55;
    color: #fff !important;
    display: flex;
    @media (max-width:1200px) {
      top: 18vw;
      font-size: 1rem;
      width: 1.5rem;
      height: 1.5rem;
    }
  `
const PrevArrowStyle = styled.div`
  position: absolute;
  top: 15vw;
  left: 12px;
  z-index: 2;
  cursor: pointer;
  font-size: 28px;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #aaaaaa55;
  color: #fff !important;
  display: flex;
  @media (max-width:1200px) {
    top: 18vw;
    font-size: 1rem;
    width: 1.5rem;
    height: 1.5rem;
  }
  `

const Iframe = styled.iframe`
  width:1016px;
  height:542px;
  margin: 1rem auto;
  @media (max-width:1200px) {
    width: 85vw;
    height: 45.3vw;
  }
  `
const NextArrow = ({ onClick, sx }) => {
    return (
        <NextArrowStyle onClick={onClick} style={{ ...sx }}>
            <Icon style={{ color: '#fff', margin: 'auto' }} icon={'ooui:previous-rtl'} />
        </NextArrowStyle>
    );
};

const PrevArrow = ({ onClick, sx }) => {
    return (
        <PrevArrowStyle onClick={onClick} style={{ ...sx }}>
            <Icon style={{ color: '#fff', margin: 'auto' }} icon={'ooui:previous-ltr'} />
        </PrevArrowStyle>
    );
};
const HomeVideoSlide = (props) => {
    const { column, data, func, is_manager } = props;
    const { style } = column;

    let slide_setting = {
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        nextArrow: <NextArrow onClick sx={{ top: window.innerWidth > 1200 ? '200px' : '15vw' }} />,
        prevArrow: <PrevArrow onClick sx={{ top: window.innerWidth > 1200 ? '200px' : '15vw' }} />,
    }
    return (
        <>
            <FullWrappers style={{
                height: window.innerWidth > 1200 ? '600px' : '50vw',
                backgroundImage: `url(${column?.src})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'fixed',
                display: 'flex',
                flexDirection: 'column',
                margin: `0 auto`,
                backgroundAttachment: 'fixed',
                marginTop:`${style?.margin_top}px`
            }}>

                <Row style={{ flexDirection: 'column', margin: '1rem auto 0 auto', alignItems: 'center' }}>
                    {column?.title &&
                        <>
                            <div style={{ fontSize: themeObj.font_size.size3, fontWeight: 'bold', color: '#fff' }}>{column?.title}</div>
                            {column?.sub_title &&
                                <>
                                    <div style={{ fontSize: themeObj.font_size.size5, color: themeObj.grey[300] }}>{column?.sub_title}</div>
                                </>}
                        </>}
                </Row>
                <Slider {...slide_setting}>
                    {column?.list && column?.list.map((item, idx) => {
                        let link = item?.link;
                        link = link.split('?')[1];
                        link = link.split('=')[1];
                        return <>
                            <Row style={{ flexDirection: 'column', }}>
                                <Iframe src={`https://www.youtube.com/embed/${link}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                                </Iframe>
                            </Row>
                        </>
                    })}
                </Slider>
            </FullWrappers>
        </>
    )
}
export default HomeVideoSlide;