import React, { useEffect, useState } from "react";
import Item from "./Item";

const sortFunc = (list, key, reverse, onRemoveItem) => {

const newListCopy = [...list];

if(key){
  newListCopy.sort((a, b) => {
    const [firstValue, secondValue] = reverse ? [b[key], a[key]] : [a[key], b[key]];
   
    if(typeof firstValue === 'string'){
        return firstValue.localeCompare(secondValue)
    }else{
        return firstValue - secondValue
    }
  }); 
}
  return newListCopy.map(item => (
  <Item
   key={item.objectID}
   item={item}
   onRemoveItem={onRemoveItem}
 />
));
}

const List = ({ list, sortBy, reverse, onRemoveItem }) =>{
  console.log(sortBy)
  return sortFunc(list, sortBy,reverse, onRemoveItem);
}

export default List;
