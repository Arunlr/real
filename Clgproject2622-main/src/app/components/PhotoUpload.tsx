import { useState, useRef } from 'react';
import { Camera, Upload, Check, X } from 'lucide-react';

interface PhotoUploadProps {
  label?: string;
  helperText?: string;
  onImageChange?: (file: File | null) => void;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
}

export function PhotoUpload({ 
  label = "Profile Photo",
  helperText = "Upload a photo to verify your identity",
  onImageChange,
  size = 'lg',
  required = false
}: PhotoUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Simulate upload progress
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        onImageChange?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange?.(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Label */}
      {label && (
        <label className="block font-medium text-gray-900 mb-3 text-center">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Upload Container */}
      <div
        className={`${sizeClasses[size]} relative rounded-full cursor-pointer transition-all group`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Main Circle */}
        <div
          className={`w-full h-full rounded-full border-4 transition-all overflow-hidden ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : imageUrl
              ? 'border-green-500 bg-white'
              : isHovering
              ? 'border-blue-400 bg-blue-50 scale-105'
              : 'border-dashed border-gray-300 bg-gray-50'
          }`}
        >
          {/* Image Preview */}
          {imageUrl && !isUploading && (
            <img
              src={imageUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          )}

          {/* Default State - Camera Icon */}
          {!imageUrl && !isUploading && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Camera
                className={`${iconSizes[size]} ${
                  isHovering || isDragging ? 'text-blue-600' : 'text-gray-400'
                } transition-colors`}
              />
              <p className={`mt-2 text-xs font-medium ${
                isHovering || isDragging ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {isDragging ? 'Drop here' : 'Upload'}
              </p>
            </div>
          )}

          {/* Uploading State - Progress */}
          {isUploading && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50">
              <div className="relative">
                {/* Circular Progress */}
                <svg className={iconSizes[size]} viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${uploadProgress}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <Upload className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-2 text-xs font-medium text-blue-600">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Hover Overlay with Camera Icon */}
        {imageUrl && !isUploading && (isHovering || isDragging) && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </div>
        )}

        {/* Success Badge */}
        {imageUrl && !isUploading && !isHovering && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Remove Button */}
        {imageUrl && isHovering && !isUploading && (
          <button
            onClick={handleRemove}
            className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-colors z-10"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Drag Indicator Ring */}
        {isDragging && (
          <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className="mt-3 text-sm text-gray-600 text-center max-w-xs">
          {helperText}
        </p>
      )}

      {/* Additional Info */}
      <p className="mt-1 text-xs text-gray-500 text-center">
        Supports: JPG, PNG, GIF (max 5MB)
      </p>
    </div>
  );
}
