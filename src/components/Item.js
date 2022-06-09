import React from "react";
import './componentStyle.css';



const Item = ({ item, onRemoveItem }) => (
    <div className="item_list_cont">
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span><b>Author:</b> {item.author}</span>
      <span><b>No. Comments:</b> {item.num_comments}</span>
      <span><b>Points:</b> {item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  );

  export default Item;