import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PhotoUpload } from '../components/PhotoUpload';
import { CheckCircle } from 'lucide-react';

export function PhotoUploadDemo() {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [locationPhoto, setLocationPhoto] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Photo Upload Component
            </h1>
            <p className="text-xl text-gray-600">
              Minimal, modern circular upload with multiple states
            </p>
          </div>

          {/* Demo Sections */}
          <div className="space-y-12">
            {/* Large Size Demo */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Verification Photo Upload
              </h2>
              <div className="flex flex-col items-center">
                <PhotoUpload
                  label="Profile Photo"
                  helperText="Upload a photo to verify your identity. Make sure your face is clearly visible."
                  size="lg"
                  required
                  onImageChange={(file) => setProfilePhoto(file)}
                />
                {profilePhoto && (
                  <div className="mt-4 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Photo uploaded successfully!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Multiple Uploads Example */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Complete Your Verification
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Upload all required photos to complete your verifier profile
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Photo */}
                <div>
                  <PhotoUpload
                    label="Profile Photo"
                    helperText="Clear photo of your face"
                    size="md"
                    required
                    onImageChange={(file) => setProfilePhoto(file)}
                  />
                </div>

                {/* ID Photo */}
                <div>
                  <PhotoUpload
                    label="Government ID"
                    helperText="Upload your Aadhaar, PAN, or Driving License"
                    size="md"
                    required
                    onImageChange={(file) => setIdPhoto(file)}
                  />
                </div>

                {/* Location Photo */}
                <div>
                  <PhotoUpload
                    label="Location Proof"
                    helperText="Recent photo showing your current location"
                    size="md"
                    onImageChange={(file) => setLocationPhoto(file)}
                  />
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                  <span className="text-sm font-medium text-blue-600">
                    {[profilePhoto, idPhoto, locationPhoto].filter(Boolean).length} / 3
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${([profilePhoto, idPhoto, locationPhoto].filter(Boolean).length / 3) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Size Variations */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Size Variations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Small */}
                <div className="flex flex-col items-center">
                  <h3 className="font-semibold text-gray-900 mb-4">Small (96px)</h3>
                  <PhotoUpload
                    label=""
                    helperText="Compact size for thumbnails"
                    size="sm"
                  />
                </div>

                {/* Medium */}
                <div className="flex flex-col items-center">
                  <h3 className="font-semibold text-gray-900 mb-4">Medium (128px)</h3>
                  <PhotoUpload
                    label=""
                    helperText="Standard size for profiles"
                    size="md"
                  />
                </div>

                {/* Large */}
                <div className="flex flex-col items-center">
                  <h3 className="font-semibold text-gray-900 mb-4">Large (160px)</h3>
                  <PhotoUpload
                    label=""
                    helperText="Large size for verification"
                    size="lg"
                  />
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Component Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Interactive States</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      Default state with camera icon
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      Hover state with scale animation
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      Uploading state with progress indicator
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      Success state with green check badge
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      Drag and drop support
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-3">User Experience</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      Click or drag to upload
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      Image preview after upload
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      Remove button on hover
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      Helper text and file format info
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      Smooth transitions and animations
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Usage Example
              </h2>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`import { PhotoUpload } from './components/PhotoUpload';

function MyComponent() {
  const [photo, setPhoto] = useState<File | null>(null);

  return (
    <PhotoUpload
      label="Profile Photo"
      helperText="Upload a photo to verify your identity"
      size="lg"
      required
      onImageChange={(file) => setPhoto(file)}
    />
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
