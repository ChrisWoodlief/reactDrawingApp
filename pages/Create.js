import React, { useEffect, useState } from "react";
import Immutable from 'Immutable';
import {AuthButton} from './Login.js'
import ColorSelector from '../components/colorSelector'


export default function DrawPage(){

  let [currentDrawing, setCurrentDrawing] = useState(null);
  let [currentColor, setCurrentColor] = useState('black');

  async function saveDrawing(){
    const response = await fetch('/api/saveDrawing');
    const data = await response.json();
    setCurrentDrawing(data.drawing);
  }

  function colorUpdated(updatedColor){
    setCurrentColor(updatedColor);
  }

  let currentDrawingInfo;
  if(currentDrawing){
    currentDrawingInfo = <div>Drawing is on server. ID: {currentDrawing.id}</div>;
  }else{
    currentDrawingInfo = <div>Drawing is not uploaded to server</div>;
  }
  return (
    <>
      <AuthButton/>
      <DrawArea currentColor={currentColor} />
      <div className="drawPageActionsArea">
        <ColorSelector colorUpdated={colorUpdated}/>
        <button onClick={saveDrawing}>Save Drawing</button>
        {currentDrawingInfo}
      </div>
    </>
  )
}


/** lines
{
  points,
  color
}
**/
let firstStrokeTime;
class DrawArea extends React.Component {
  constructor(props) {
    super();

    this.state = {
      lines: new Immutable.List(),
      isDrawing: false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    if(this.state.lines.size == 0){
      console.log('first stroke recorded!');
      firstStrokeTime = Date.now();
    }
    this.setState((prevState) => ({
      lines: prevState.lines.push({points: new Immutable.List([point]), color: this.props.currentColor}),
      isDrawing: true
    }));
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    this.setState((prevState) => ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], (line) => {
        line.points = line.points.push(point);
        return line;
      }
      )
    }));
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  componentDidUpdate(newProps) {
    if(newProps.currentColor !== this.props.currentColor){
      this.setState(newProps);
    }
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top
    });
  }

  render() {
    return (
      <div
        className="drawArea"
        ref="drawArea"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
      >
        <Drawing
          lines={this.state.lines}
        />
      </div>
    );
  }
}

function Drawing({ lines }) {
  return (
    <svg className="innerDrawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} />
      ))}
    </svg>
  );
}

function DrawingLine({ line, color }) {
  const pathData =
    "M " +
    line.points
      .map((p) => {
        return `${p.get("x")} ${p.get("y")}`;
      })
      .join(" L ");
  //console.log(`pathData ${pathData}`);
  return <path className="path" d={pathData} stroke={line.color} />;
}
