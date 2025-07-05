const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`spinner ${sizeClasses[size]} border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin`}></div>
  )
}

export default LoadingSpinner