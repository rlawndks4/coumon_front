import styled from "styled-components";
import { themeObj } from "../styled-components";

export const Title = styled.div`
font-size: ${themeObj.font_size.size3};
font-weight: bold;
margin: 0 auto;
@media (max-width:1000px) {
  margin: 0 auto 0 0;
}
`
export const SubTitle = styled.div`
font-size: ${themeObj.font_size.size5};
color: ${themeObj.grey[500]};
margin: 0 auto;
@media (max-width:1000px) {
  margin: 0 auto 0 0;
}
`
