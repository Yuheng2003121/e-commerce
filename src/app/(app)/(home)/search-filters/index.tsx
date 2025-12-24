import React from 'react'
import SearchInput from './SearchInput';
import Categories from './Categories';


interface SearchFilterProps {
  data: any;
}

export default function SearchFilter({data}: SearchFilterProps) {
  return (
    <div className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4'>
      <SearchInput disabled={false}/>
      <Categories data={data}/>
    </div>
  )
}
