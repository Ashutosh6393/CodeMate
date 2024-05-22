import React from 'react'

function Logo({width="w-20", className=""}) {
  return (
    <img className={`${width} p-2 ${className}`} src="./logo.png" alt="logo" />
  )
}

export default Logo