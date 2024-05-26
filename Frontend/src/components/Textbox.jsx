import React from 'react'

function Textbox({...props}) {
  return (
    <textarea {...props}  className='resize-none h-full w-full text-white-0 p-2 text-base bg-bg-0 rounded-md focus:outline-none'></textarea>
  )
}

export default Textbox