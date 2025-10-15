function CircularProgress({ 
    value, 
    maxValue = 100, 
    size = 120, 
    strokeWidth = 8, 
    color = "#3b82f6", 
    bgColor = "#374151",
    showProgress = true,
    label,
    unit = ""
  }: {
    value: number;
    maxValue?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    bgColor?: string;
    showProgress?: boolean;
    label: string;
    unit?: string;
  }){
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = showProgress ? (value / maxValue) * 100 : 100; // Full circle for non-progress metrics
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
  
    // Use the provided color directly
    const dynamicColor = color;
  
    return (
      <div className="flex flex-col items-center p-6 bg-gray-700/30 rounded-xl border border-gray-600">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={bgColor}
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={dynamicColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 6px ${dynamicColor}40)`
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {value}{unit}
            </span>
            {showProgress && (
              <span className="text-sm text-gray-400">
                /{maxValue}
              </span>
            )}
          </div>
        </div>
        
        <h3 className="mt-4 text-lg font-semibold text-gray-200 text-center">
          {label}
        </h3>
        
      </div>
    );
  };

export default CircularProgress;