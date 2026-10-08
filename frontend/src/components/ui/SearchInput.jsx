import { Search } from 'lucide-react';

export default function SearchInput({ label = 'Search', className = '', ...props }) {
  return (
    <label className={`ui-search ${className}`.trim()}>
      <span className="sr-only">{label}</span>
      <Search size={18} aria-hidden="true" />
      <input aria-label={label} type="search" {...props} />
    </label>
  );
}
