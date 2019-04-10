import React, { Component } from 'react';
import Konva from 'konva';
import Vector from 'maths-vector';
import { Stage, Layer, Circle, Arrow, Text } from 'react-konva';

// 旋转坐标系，默认的 canvas 坐标系，y 轴是向下的
const unitX = new Vector(1, 0); // 单位 x 向量
const unitY = new Vector(0, 1); // 单位 y 向量
const unitInvert = new Vector(1, -1); // 用于翻转正交系

// （5, 10） 在 canvas 图（原点是 (40, 60)）中的位置为
// (40 + 5, 60 - 10) => (45, 50)
function normalToCanvasPoint(normalVector, canvasOriginVector) {
  return normalVector
    .add(unitInvert.multiply(canvasOriginVector))
    .multiply(unitInvert);
}

export const Coordinate = ({
  scale = 1,
  offset = 0.1,
  unit = 100,
  origin = new Vector(0, 0),
  pointerLength = 10,
  pointerWidth = 10,
  fill = '#000',
  strokeWidth = 1
}) => {
  const { x, y } = origin.toObject();
  // 获取原点坐标
  const axisLength = (scale + offset) * unit;

  const startX = normalToCanvasPoint(unitX.multiplyX(-axisLength), origin);
  const endX = normalToCanvasPoint(unitX.multiplyX(axisLength), origin);

  const startY = normalToCanvasPoint(unitY.multiplyY(-axisLength), origin);
  const endY = normalToCanvasPoint(unitY.multiplyY(axisLength), origin);

  return (
    <Layer>
      <Circle
        x={x}
        y={y}
        radius={100}
        dashEnabled={true}
        dash={[8, 8]}
        stroke={fill}
        strokeWidth={strokeWidth}
      />
      <Arrow
        points={[...startX.toArray(), ...endX.toArray()]}
        pointerLength={pointerLength}
        pointerWidth={pointerWidth}
        fill={fill}
        stroke={fill}
        strokeWidth={strokeWidth}
      />
      <Arrow
        points={[...startY.toArray(), ...endY.toArray()]}
        pointerLength={pointerLength}
        pointerWidth={pointerWidth}
        fill={fill}
        stroke={fill}
        strokeWidth={strokeWidth}
      />
    </Layer>
  );
};

export default class ColoredRect extends Component {
  state = {
    color: 'green'
  };
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };
  render() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    return (
      <Stage width={width / 2} height={height / 2}>
        <Coordinate
          scale={1.5}
          origin={new Vector(width / 4 - 200, height / 4)}
        />
        <Coordinate
          scale={1.5}
          origin={new Vector(width / 4 + 200, height / 4)}
        />
      </Stage>
    );
  }
}
