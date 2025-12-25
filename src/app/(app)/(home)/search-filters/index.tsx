import React from 'react'
import SearchInput from './SearchInput';
import Categories from './Categories';
import { CustomCategory } from '../types';


interface SearchFilterProps {
  data: CustomCategory[];
}

export default function SearchFilter({data}: SearchFilterProps) {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4">
      <SearchInput disabled={false} data={data}/>
      <div className='hidden lg:block'>
        <Categories data={data} />
      </div>
    </div>
  );
}
