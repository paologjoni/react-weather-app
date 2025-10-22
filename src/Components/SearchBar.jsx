import React, { useRef } from "react";

function SearchBar({ setCity }) {
  const inputRef = useRef();

  function handleClick() {
    const value = inputRef.current.value;
    setCity(value);
    console.log("Searching for:", value);
  }

  return (
    <div className="bigSearch">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter"
        className="search"
      />
      <button className="button" onClick={handleClick}>
        <img src="https://static.thenounproject.com/png/4009566-200.png" />
      </button>
    </div>
  );
}

export default SearchBar;
