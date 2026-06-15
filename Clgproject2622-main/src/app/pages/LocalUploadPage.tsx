import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Upload, X, CheckCircle, Camera, MapPin } from 'lucide-react';

const mockTaskDetails: Record<string, any> = {
  '1': {
    id: 1,
    placeName: 'XYZ Hotel',
    address: '456 Indiranagar, Bangalore',
    placeType: 'Hotel',
  },
  '2': {
    id: 2,
    placeName: 'Green Valley Apartments',
    address: '789 HSR Layout, Bangalore',
    placeType: 'Apartment/Flat',
  },
  '3': {
    id: 3,
    placeName: 'Tech Institute',
    address: '321 Whitefield, Bangalore',
    placeType: 'School/College',
  },
};

const checklistItems = [
  'Safety & Security (CCTV, guards, locks)',
  'Cleanliness (rooms, bathrooms, common areas)',
  'Amenities (WiFi, hot water, furniture)',
  'Nearby Facilities (shops, transport, restaurants)',
  'Overall Condition (maintenance, repairs needed)',
  'Match with advertised photos',
];

export function LocalUploadPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const task = mockTaskDetails[taskId || '1'];

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleChecklistItem = (item: string) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate upload
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Verification submitted successfully! Credits will be added to your account within 24 hours.');
      navigate('/local/tasks');
    }, 2000);
  };

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
            <button
              onClick={() => navigate('/local/tasks')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Tasks
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Task Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.placeName}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              {task.address}
            </div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {task.placeType}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Upload Photos
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Upload at least 5 clear photos showing different aspects of the location
              </p>

              {/* Upload Area */}
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">JPG, PNG (max 10MB each)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  {uploadedFiles.length} photo{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                  {uploadedFiles.length < 5 && ` (minimum 5 required)`}
                </div>
              )}
            </div>

            {/* Verification Checklist */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Verification Checklist
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Check off what you verified at the location
              </p>

              <div className="space-y-3">
                {checklistItems.map(item => (
                  <label
                    key={item}
                    className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item] || false}
                      onChange={() => toggleChecklistItem(item)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-900">{item}</span>
                    {checklist[item] && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-xl text-gray-900 mb-4">Additional Notes</h2>
              <p className="text-sm text-gray-600 mb-4">
                Share any important observations or concerns
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., The WiFi speed was slower than advertised, or the neighborhood was quieter than expected..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Guidelines */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Verification Guidelines</h3>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>Take clear, well-lit photos from multiple angles</li>
                <li>Be honest and objective in your observations</li>
                <li>Do not share personal information or contact details</li>
                <li>Respect privacy - avoid photographing people without permission</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/local/tasks')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || uploadedFiles.length < 5}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Verification'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
