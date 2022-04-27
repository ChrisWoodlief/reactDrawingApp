import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {DRAW_AREA_ERASER_STRING} from '../helpers/frontEndHelpers';

let colors = ['Black', 'Red', 'Blue', 'Green', 'Yellow', DRAW_AREA_ERASER_STRING];

export default function ColorSelector(props){

  if(!props.currentColor){
    props.colorUpdated('Black');
  }

  function handleClick(event){
    props.colorUpdated(event.target.value);
  }

  const listItems = colors.map((color) =>
    <Button variant="secondary" value={color} className={color == props.currentColor ? 'active': ''}>{color}</Button>
  );

  return (
    <ButtonGroup aria-label="Basic example" onClick={handleClick}>
      {listItems}
    </ButtonGroup>
  );
}
