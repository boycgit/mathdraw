import React, { Component } from 'react';
import logo from './logo.svg';
import './App.less';
import {
  AppContainer,
  AppHeader,
  AppTitle,
  AppLogo,
  AppIntro
} from './styles/app.style';

// import ShinedBox from './mods/box';
import Formula from './mods/formula';
import ColoredRect from './mods/cord';

class App extends Component {
  render() {
    return (
      <AppContainer>
        <AppHeader>
          <AppLogo src={logo} alt="logo" />
          <AppTitle>掌声欢迎来到 React</AppTitle>
        </AppHeader>
        <AppIntro>
          To get started, edit <code>src/App.js</code> and save to reload.
          {/* <ShinedBox /> */}
          <Formula />
          <ColoredRect/>
        </AppIntro>
      </AppContainer>
    );
  }
}

export default App;
