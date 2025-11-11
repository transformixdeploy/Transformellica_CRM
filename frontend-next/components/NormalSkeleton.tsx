import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Props {
  width?: number | string,
  count?: number,
  baseColor?: string,
  highlightColor?: string,
}

const NormalSkeleton = ({
  //Default values
  width = "100%",
  count = 1,
  baseColor = "#2c3e50",
  highlightColor = "#34495e",
}: Props) => {
  return (
    <Skeleton 
      className='shadow-2xl'
      width={width} 
      count={count}
      baseColor={baseColor} 
      highlightColor={highlightColor}
    />
  )
}

export default NormalSkeleton