import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

let widths = ['2px', '5px', '10px', '20px'];

export default function WidthSelector(props){

  if(!props.currentWidth){
    props.widthUpdated('5px');
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
