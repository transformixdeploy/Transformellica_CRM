import React from 'react'

const Test = () => {
  return (
    <>
        <p>{process.env.PORT}</p>
        <p>{process.env.NEXT_PUBLIC_BACKEND_URL}</p>
    </>
  )
}

export default Test