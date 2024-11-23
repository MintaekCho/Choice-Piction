export function ChoiceFictionLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-6 h-6">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-amber-500 rounded-lg transform rotate-45"></div>
        <div className="absolute inset-0.5 bg-gray-900 rounded-md transform rotate-45"></div>
        <div className="absolute inset-1 bg-gradient-to-br from-purple-600 to-amber-500 rounded-sm transform rotate-45 animate-pulse"></div>
      </div>
      <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
        Choice Fiction
      </span>
    </div>
  );
} 