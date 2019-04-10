import React, { Component } from 'react';
import posed from 'react-pose';
import { Box } from "../styles/app.style";

const config = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};
const PosedBox = posed(Box)(config);

export default class ShinedBox extends Component {
  state = { isVisible: true };

  componentDidMount() {
    setInterval(() => {
      this.setState({ isVisible: !this.state.isVisible });
    }, 1000);
  }

  render() {
    const { isVisible } = this.state;
    return (
        <PosedBox className="box" pose={this.state.isVisible ? 'visible' : 'hidden'} />
    );
  }
}
