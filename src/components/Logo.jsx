import React from 'react'
import {logo} from '../images/images'

function Logo({width="w-20", className=""}) {
  return (
    <img className={`${width} p-2 ${className}`} src={logo} alt="logo" />
  )
}

export default Logo