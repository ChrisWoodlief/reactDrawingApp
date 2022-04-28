import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

let widths = ['3', '6', '12', '24'];

export default function WidthSelector({widthUpdated, currentWidth='6'}){

  //Inform the parent of the width on first render, since default may have changed it
  useEffect(() => {
    widthUpdated(currentWidth);
  }, []);

  function handleClick(event){
    widthUpdated(event.target.value);
  }

  const listItems = widths.map((width) =>
    <Button key={width} variant="secondary" value={width} className={width == currentWidth ? 'active': ''}>{width}</Button>
  );

  return (
    <ButtonGroup aria-label="Basic example" onClick={handleClick}>
      {listItems}
    </ButtonGroup>
  );
}
