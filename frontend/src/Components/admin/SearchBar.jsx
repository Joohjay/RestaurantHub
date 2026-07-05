import { LuSearch } from "react-icons/lu";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="adminSearchBar">
      <LuSearch size={18} />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchBar;
