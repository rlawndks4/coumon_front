import { Icon } from '@iconify/react'
import Slider from 'react-slick'
import styled from 'styled-components'
import _ from 'lodash'
import { Row, themeObj } from 'src/components/elements/styled-components'
import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { Button } from '@mui/material'
import { varFade } from 'src/components/animate'
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
const BannerImgContainer = styled.div`
width: 78vw;
height: 33.15vw;
margin: 0 auto;
border-radius:${props => props.img_list_length >= 2 ? '1rem' : '0'};
overflow: hidden;
@media (max-width:1200px) {
    width: 100vw;
    height: 42.5vw;
    border-radius:0;
}
`
const BannerImgContent = styled.div`
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
display:flex;
position: relative;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
animation: ${props => props.iscurrentSlideIndex ? 'zoom-in-out' : ''} 10s ease-in-out infinite;
@keyframes zoom-in-out {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.02);
    }
    100% {
        transform: scale(1);
    }
  }

}
`

const TextContainer = styled.div`
display:flex;
flex-direction:column;
position:absolute;
right:8rem;
top:12vw;
z-index:10;
align-items:end;
row-gap:1rem;
@media (max-width:1200px) {
    right:4rem;
    top:10vw;
    row-gap:0rem;
}
`
const SlideTitle = styled.div`
font-size:${themeObj.font_size.size1};
font-weight:bold;
color:#fff;
@media (max-width:1200px) {
font-size:${themeObj.font_size.size3};
}
@media (max-width:600px) {
font-size:${themeObj.font_size.size5};
}
`
const SlideSubTitle = styled.div`
font-size:${themeObj.font_size.size3};
color:#fff;
@media (max-width:1200px) {
font-size:${themeObj.font_size.size4};
}
@media (max-width:600px) {
    font-size:${themeObj.font_size.size6};
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

const HomeBanner = (props) => {
    const { column, data, func, is_manager } = props;
    let { windowWidth } = data;
    const { style } = column;
    let img_list = [...column?.list];
    const [arrowHeight, setArrowHeight] = useState('15vw')
    const imageContainerRef = useRef();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const afterChangeHandler = (currentSlide) => {
        setCurrentSlideIndex(currentSlide);
    };

    let slide_setting = {
        centerMode: true,
        centerPadding: (img_list.length >= 2 ? (windowWidth > 1200 ? '10%' : 0) : 0), // 이미지 간격을 조절할 수 있는 값입니다.
        infinite: true,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        nextArrow: <NextArrow onClick sx={{ top: arrowHeight }} />,
        prevArrow: <PrevArrow onClick sx={{ top: arrowHeight }} />,
        afterChange: afterChangeHandler,
    }
    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    useEffect(() => {
        if (imageContainerRef.current?.clientHeight) {
            setArrowHeight(`${imageContainerRef.current?.clientHeight / 2 - 16}px`)
        }
    }, [imageContainerRef.current])
    return (
        <>
            <FullWrappers style={{ marginTop: `${style?.margin_top}px` }}
                ref={imageContainerRef}
            >
                <Slider {...slide_setting}>
                    {img_list.map((item, idx) => (
                        <>
                            <BannerImgContainer
                                style={{ minHeight: `${style?.min_height}px` }}
                                img_list_length={img_list.length}
                            >

                                <BannerImgContent
                                    iscurrentSlideIndex={currentSlideIndex == idx}
                                    style={{
                                        width: `${img_list.length >= 2 ? '' : '100vw'}`,
                                        backgroundImage: `url(${item.src})`,
                                    }}
                                >
                                    {currentSlideIndex == idx &&
                                        <>
                                            <TextContainer>
                                                {item?.title &&

                                                    <m.div
                                                        initial="hidden"
                                                        animate="visible"
                                                        variants={fadeInUpVariants}
                                                    >
                                                        <SlideTitle style={{ color: `${item?.title_color ?? ""}` }}>
                                                            {item?.title}
                                                        </SlideTitle>
                                                    </m.div>
                                                }
                                                {item?.sub_title &&
                                                    <m.div
                                                        initial="hidden"
                                                        animate="visible"
                                                        variants={fadeInUpVariants}>
                                                        <SlideSubTitle style={{ color: `${item?.sub_title_color ?? ""}` }}>
                                                            {item?.sub_title}
                                                        </SlideSubTitle>
                                                    </m.div>
                                                }
                                                {item?.link &&
                                                    <m.div
                                                        initial="hidden"
                                                        animate="visible"
                                                        variants={fadeInUpVariants}>
                                                        <Button variant='outlined' onClick={() => {
                                                            if (!is_manager) {
                                                                window.location.href = item?.link;
                                                            }
                                                        }}>
                                                            VIEW MORE
                                                        </Button>
                                                    </m.div>}
                                            </TextContainer>
                                        </>}
                                </BannerImgContent>
                            </BannerImgContainer>

                        </>
                    ))}
                </Slider>
            </FullWrappers>
        </>
    )
}
export default HomeBanner;