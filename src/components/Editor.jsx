import React from 'react'
import {MonacoEditorComponent} from './index'

function Editor({width = "w-10/12"}) {
  return (
    <div className={`${width} h-screen border-2`}>
        <MonacoEditorComponent/>
    </div>
  )
}

export default Editor