interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  return (
    <div className="search-container">
      <input type="text" value={search} placeholder="Search country" onChange={(e) => setSearch(e.target.value)} />
    </div>
  )
}
