import React from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

const reactSelectStyle = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    width: "100%",
    fontSize: "12px",
    appearance: "none",
    border: "1.5px solid #46D97E",
    borderRadius: "0.5rem",
    padding: "1px 2px 0px 2px",
    color: "#7b7b7b",
    lineHeight: "tight",
    outline: "none",
    boxShadow: "none",
    ":focus": {
      border: "1.5px solid #00FF00",
      boxShadow: "none",
    },
    ":hover": {
      border: "1.5px solid #46D97E",
      boxShadow: "none",
    },
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isFocused ? "#46D97E" : baseStyles.backgroundColor, // Change option background color on focus
    color: state.isSelected ? "white" : baseStyles.color, // Change option text color when selected
    fontSize: "12px",
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    zIndex: 2, // Adjust the value based on your needs
  }),
};

const InputField = (props) => {
  const { label, value, setValue } = props;

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="py-2 relative mr-[20px] ml-[10px]">
      <label
        className="bg-white bg-opacity-100 text-[10px] font-bold mb-2 absolute top-[0.5px] left-[15px] px-1"
        htmlFor="inputField"
      >
        {label}
      </label>
      <input
        type="text"
        id="inputField"
        className="w-full h-[35px] text-[12px] appearance-none  border-[#46D97E] border-[1.5px] rounded-lg py- pl-3 pr-[20px] text-gray-700 leading-tight focus:outline-none focus:border-[#00FF00]"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

const DivField = (props) => {
  const { label, data } = props;

  return (
    <div className="py-2 relative mr-[20px] ml-[10px]">
      <label
        className="bg-white bg-opacity-100 text-[10px] font-bold mb-2 absolute top-[0.5px] left-[15px] px-1"
        htmlFor="inputField"
      >
        {label}
      </label>
      <div className="w-full text-[12px] h-[35px] appearance-none border-[#46D97E] border-[1.5px] rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#00FF00]">
        {data}
      </div>
    </div>
  );
};

const TextField = (props) => {
  const { label, value, setValue } = props;

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="py-2 relative mr-[20px] ml-[10px]">
      <label
        className="bg-white bg-opacity-100 text-[10px] font-bold mb-2 absolute top-[0.5px] left-[15px] px-1"
        htmlFor="inputField"
      >
        {label}
      </label>
      <textarea
        className="w-full text-[12px] appearance-none border-[#46D97E] border-[1.5px] rounded-lg py-2 pl-3 pr-[20px] text-gray-700 leading-tight focus:outline-none focus:border-[#00FF00]"
        value={value}
        onChange={handleChange}
        rows={4}
      />
    </div>
  );
};

const MultiCreate = (props) => {
  const [inputValue, setInputValue] = React.useState("");
  const { label, value, setValue } = props;

  const components = {
    DropdownIndicator: null,
  };

  function extractDomain(url) {
    try {
      // Remove protocol (http, https, etc.)
      let withoutProtocol = url.replace(/^https?:\/\//, "");

      // Remove 'www.' if present
      withoutProtocol = withoutProtocol.replace(/^www\./, "");

      // Extract domain (excluding path, query string, and fragments)
      const domain = withoutProtocol.split(/[/?#]/)[0];

      return domain;
    } catch (error) {
      console.error("Error extracting domain:", error);
      return null;
    }
  }

  const createOption = (value) => {
    const label = extractDomain(value);
    return {
      label: label,
      value: value,
    };
  };

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
        break;
      default:
    }
  };

  return (
    <div className="py-2 relative mr-[20px] ml-[10px]">
      <label
        className="z-10 bg-white bg-opacity-100 text-[10px] font-bold mb-2 absolute top-[0.5px] left-[15px] px-1"
        htmlFor="inputField"
      >
        {label}
      </label>
      <CreatableSelect
        styles={reactSelectStyle}
        components={components}
        inputValue={inputValue}
        isClearable={false}
        isMulti
        menuIsOpen={false}
        onChange={(newValue) => setValue(newValue)}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        placeholder=""
        value={value}
      />
    </div>
  );
};

const MultiSelect = (props) => {
  const { label, value, setValue } = props;

  return (
    <div className="py-2 relative mr-[20px] ml-[10px]">
      <label
        className="z-[1] bg-white bg-opacity-100 text-[10px] font-bold mb-2 absolute top-[0.5px] left-[15px] px-1"
        htmlFor="inputField"
      >
        {label}
      </label>
      <Select
        styles={reactSelectStyle}
        options={value.map((element) => ({ label: element, value: element }))}
        onChange={(newValue) => setValue((prev) => [...prev, newValue])}
        isMulti
        placeholder=""
      />
    </div>
  );
};

export { InputField, DivField, TextField, MultiCreate, MultiSelect };
