import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Props {
  width?: number | string,
  height?: number | string,
  borderRadius?: string | number,
  baseColor?: string,
  highlightColor?: string,
  className?: string
}

const BoxSkeleton = ({
  //Default values
  width = 200,
  height = 200,
  className = "",
  borderRadius = "20%",
  baseColor = "#2c3e50",
  highlightColor = "#34495e",
}: Props) => {
  return (
    <Skeleton 
      className={`shadow-2xl ${className}`}
      width={width} 
      height={height} 
      borderRadius={borderRadius} 
      baseColor={baseColor} 
      highlightColor={highlightColor}
    />
  )
}

export default BoxSkeleton