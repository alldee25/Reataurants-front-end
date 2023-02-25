import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { Fetch } from "./fetch/fetch";
import styled from "styled-components";

const AutocompleteInput = ({
  setKeywordLocation,
  keywordLocation,
  waitTime = 500,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [keyword, setKeyword] = useState("");

  const fetchSuggestions = async () => {
    try {
      const response = await Fetch({
        method: "GET",
        path: "/api/restaurant/search",
        params: { keyword: keyword },
      });
      setSuggestions(response.result);
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, waitTime);

  useEffect(() => {
    if (keyword) {
      debouncedFetch();
    } else {
      setSuggestions([]);
    }

    return debouncedFetch.cancel;
  }, [keyword, waitTime]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setKeywordLocation(inputValue);
    setKeyword(inputValue);
    setShowDropdown(true);
  };

  const handleSelect = (selectedValue) => {
    console.log("==", selectedValue);
    setKeywordLocation(selectedValue);
    setFilteredSuggestions([]);
    setKeyword("");
    setShowDropdown(false);
  };

  useEffect(() => {
    setFilteredSuggestions(
      suggestions.filter((suggestion) =>
        suggestion?.description
          .toLowerCase()
          .startsWith(keywordLocation.toLowerCase())
      )
    );
  }, [, keywordLocation, suggestions]);

  return (
    <Main>
      <div className="autocomplete">
        <input
          className="form-control"
          placeholder="Search..."
          type="text"
          value={keywordLocation}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowDropdown(false);
            }, 300);
          }}
        />
        {showDropdown && (
          <ul className="list-group-item">
            {filteredSuggestions.map((suggestion) => (
              <li
                className="list-group-item"
                key={suggestion?.reference}
                onClick={() => handleSelect(suggestion?.description)}
              >
                {suggestion?.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Main>
  );
};

export default AutocompleteInput;
const Main = styled.div`
  width: 100%;
  height: 100%;
  .autocomplete {
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-block;
  }

  .autocomplete input {
    width: 100%;
    height: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: none;
  }

  .autocomplete ul {
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #ddd;
    list-style: none;
    margin-top: 0;
    padding-left: 0;
    max-height: 200px;
    overflow-y: scroll;
  }

  .autocomplete li {
    padding: 10px;
    cursor: pointer;
  }

  .autocomplete li:hover {
    background-color: #f4f4f4;
  }
`;
