import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import React from 'react'

interface SearchInputProps {
  disabled?: boolean
}

export default function SearchInput({disabled}: SearchInputProps) {
  return (
    <div className=''>
      <div className='relative flex items-center'>
        <SearchIcon className='absolute left-2 size-4 text-neutral-500'/>
        <Input className='pl-8' placeholder='Search Product' disabled={disabled} />
      </div>
    </div>
  )
}
