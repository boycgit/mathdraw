import styled, { keyframes } from 'styled-components';

const logoSpin = keyframes`
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
`;

export const AppContainer = styled.section`
  text-align: center;
`;

export const AppLogo = styled.img`
  animation: ${logoSpin} infinite 20s linear;
  height: 80px;
`;

export const AppHeader = styled.header`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
`;

export const AppTitle = styled.h1`
  font-size: 1.5em;
`;

export const AppIntro = styled.div`
  font-size: large;
`;

export const Box = styled.div`
  width: 100px;
  height: 100px;
  background-color: #ff1c68;
`;
