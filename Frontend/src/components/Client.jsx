import React from 'react'
import Avatar from 'react-avatar'

function Client({username}) {
  return (
    <div className='flex flex-col justify-center items-center self-start'>
        <Avatar size="90" round={true} name={username} />
        <p className='text-white-0 w-full text-center text-wrap'>{username}</p>
    </div>
  )
}

export default Client