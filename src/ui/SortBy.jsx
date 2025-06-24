import { useSearchParams } from "react-router-dom";
import Select from "./Select";

export default function SortBy({
  options,
  sortField = "sortBy", // default URL param key
  ...props
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get(sortField) || options[0].value;

  function handleChange(e) {
    searchParams.set(sortField, e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options} // ← pass it here
      value={current}
      onChange={handleChange}
      {...props}
    />
  );
}
