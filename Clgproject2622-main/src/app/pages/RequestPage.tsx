import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CheckCircle } from 'lucide-react';

export function RequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: '',
    placeType: '',
    placeName: '',
    address: '',
    priorities: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeTypes = [
    'PG/Hostel',
    'Hotel',
    'School/College',
    'Neighborhood',
    'Apartment/Flat',
    'Office Space',
  ];

  const priorityOptions = [
    'Safety & Security',
    'Cleanliness',
    'Amenities',
    'Nearby Facilities',
    'Internet Connectivity',
    'Public Transport Access',
    'Noise Levels',
    'Actual vs Photos',
  ];

  const handlePriorityToggle = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...prev.priorities, priority],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Request submitted successfully! You will be redirected to your dashboard.');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Verification</h1>
            <p className="text-gray-600 mb-8">
              Fill in the details below and we'll assign a trusted local to verify this location for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* City */}
              <div>
                <label htmlFor="city" className="block font-medium text-gray-900 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g., Mumbai, Bangalore, Delhi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Place Type */}
              <div>
                <label htmlFor="placeType" className="block font-medium text-gray-900 mb-2">
                  Place Type *
                </label>
                <select
                  id="placeType"
                  required
                  value={formData.placeType}
                  onChange={(e) => setFormData({ ...formData, placeType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a type</option>
                  {placeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Place Name */}
              <div>
                <label htmlFor="placeName" className="block font-medium text-gray-900 mb-2">
                  Place Name *
                </label>
                <input
                  type="text"
                  id="placeName"
                  required
                  value={formData.placeName}
                  onChange={(e) => setFormData({ ...formData, placeName: e.target.value })}
                  placeholder="e.g., ABC PG, XYZ Hotel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block font-medium text-gray-900 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address or Google Maps link"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Priorities */}
              <div>
                <label className="block font-medium text-gray-900 mb-3">
                  Verification Priorities
                </label>
                <p className="text-sm text-gray-600 mb-4">Select what matters most to you</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {priorityOptions.map(priority => (
                    <label
                      key={priority}
                      className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.priorities.includes(priority)}
                        onChange={() => handlePriorityToggle(priority)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-900">{priority}</span>
                      {formData.priorities.includes(priority) && (
                        <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Pricing</h3>
                <p className="text-blue-800 text-sm">
                  Standard Verification: ₹299 | Express (6 hours): ₹499
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
