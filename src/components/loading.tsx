import { Loader2 } from "lucide-react"

export function LoadingSpinner({
  size = "default",
  className = "",
}: { size?: "sm" | "default" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
}

export function LoadingButton({ children, isLoading, ...props }: any) {
  return (
    <button {...props} disabled={isLoading} className={`${props.className} ${isLoading ? "loading-button" : ""}`}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export function PageLoader() {
  return (
    <div className="loading-overlay">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-primary mb-4" />
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="quiz-card p-6 animate-pulse">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text w-2/3"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="skeleton-button"></div>
        <div className="skeleton-avatar"></div>
      </div>
    </div>
  )
}

export function SkeletonQuestionCard() {
  return (
    <div className="quiz-card p-6 animate-pulse">
      <div className="skeleton-title mb-6"></div>
      <div className="space-y-4">
        <div className="skeleton-card h-12"></div>
        <div className="skeleton-card h-12"></div>
        <div className="skeleton-card h-12"></div>
        <div className="skeleton-card h-12"></div>
      </div>
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="quiz-card p-4 animate-pulse">
          <div className="skeleton-avatar mx-auto mb-2"></div>
          <div className="skeleton-text w-16 mx-auto"></div>
          <div className="skeleton-text w-20 mx-auto"></div>
        </div>
      ))}
    </div>
  )
}
