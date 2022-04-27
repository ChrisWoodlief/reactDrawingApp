import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

let widths = ['3', '6', '12', '24'];

export default function WidthSelector(props){

  if(!props.currentWidth){
    props.widthUpdated('6');
  }

  function handleClick(event){
    props.widthUpdated(event.target.value);
  }

  const listItems = widths.map((width) =>
    <Button variant="secondary" value={width} className={width == props.currentWidth ? 'active': ''}>{width}</Button>
  );

  return (
    <ButtonGroup aria-label="Basic example" onClick={handleClick}>
      {listItems}
    </ButtonGroup>
  );
}
