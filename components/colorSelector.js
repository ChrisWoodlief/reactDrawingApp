import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

let colors = ['black', 'red', 'blue', 'green', 'yellow'];

export default function ColorSelector(props){

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
