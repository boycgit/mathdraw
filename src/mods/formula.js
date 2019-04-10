import 'katex/dist/katex.min.css';
import React, { Component } from 'react';
import { InlineMath, BlockMath } from 'react-katex';

export default function Formula(props) {
  return (
    <div>
          <BlockMath>{`\\frac{\\text{m}}{\\text{s}^2}`}</BlockMath>
          <BlockMath>{`\\int\\limits_0^\\infty  {{x^2}dx}`}</BlockMath>
    </div>
  );
}
