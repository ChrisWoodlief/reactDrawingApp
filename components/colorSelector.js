import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {DRAW_AREA_ERASER_STRING} from '../helpers/frontEndHelpers';

let colors = ['Black', 'Red', 'Blue', 'Green', 'Yellow', DRAW_AREA_ERASER_STRING];

export default function ColorSelector({colorUpdated, currentColor='Black'}){

  //Inform the parent of the color on first render, since default may have changed it
  useEffect(() => {
    colorUpdated(currentColor);
  }, []);

  function handleClick(event){
    colorUpdated(event.target.value);
  }

  const listItems = colors.map((color) => {
    const buttonInside = (color == DRAW_AREA_ERASER_STRING) ? 'Erase' : <div className='colorSelectorPreviewBox' style={{ backgroundColor: color}}></div>;
    return <Button key={color} variant="secondary" value={color} className={color == currentColor ? 'active': ''}>{buttonInside}</Button>;
  });

  return (
    <ButtonGroup aria-label="Basic example" onClick={handleClick}>
      {listItems}
    </ButtonGroup>
  );
}
