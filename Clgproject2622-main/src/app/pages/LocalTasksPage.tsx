import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MapPin, DollarSign, Clock, Navigation } from 'lucide-react';

const mockTasks = [
  {
    id: 1,
    placeName: 'XYZ Hotel',
    placeType: 'Hotel',
    address: '456 Indiranagar, Bangalore',
    distance: '1.2 km',
    credits: 250,
    priority: 'standard',
    deadline: '6 hours',
  },
  {
    id: 2,
    placeName: 'Green Valley Apartments',
    placeType: 'Apartment/Flat',
    address: '789 HSR Layout, Bangalore',
    distance: '2.8 km',
    credits: 200,
    priority: 'standard',
    deadline: '12 hours',
  },
  {
    id: 3,
    placeName: 'Tech Institute',
    placeType: 'School/College',
    address: '321 Whitefield, Bangalore',
    distance: '4.5 km',
    credits: 300,
    priority: 'express',
    deadline: '3 hours',
  },
];

export function LocalTasksPage() {
  const navigate = useNavigate();

  const handleAcceptTask = (taskId: number) => {
    navigate(`/local/upload/${taskId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Tasks</h1>
            <p className="text-gray-600">Select a task near you and start earning</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-gray-900 mb-1">₹12,450</div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-gray-900 mb-1">47</div>
              <div className="text-sm text-gray-600">Completed Tasks</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-gray-900 mb-1">4.8</div>
              <div className="text-sm text-gray-600">Your Rating</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-gray-900 mb-1">{mockTasks.length}</div>
              <div className="text-sm text-gray-600">Available Near You</div>
            </div>
          </div>

          {/* Task List */}
          {mockTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks available</h3>
              <p className="text-gray-600">
                Check back soon for new verification tasks in your area.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockTasks.map(task => (
                <div key={task.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">
                          {task.placeName}
                        </h3>
                        {task.priority === 'express' && (
                          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            Express
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {task.address}
                        </div>
                        <div className="flex items-center">
                          <Navigation className="w-4 h-4 mr-2" />
                          {task.distance} away
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Complete within {task.deadline}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {task.placeType}
                        </span>
                      </div>
                    </div>

                    {/* Credits and Action */}
                    <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2">
                      <div className="text-center md:text-right">
                        <div className="flex items-center justify-center md:justify-end text-2xl font-bold text-green-600 mb-1">
                          <DollarSign className="w-5 h-5" />
                          ₹{task.credits}
                        </div>
                        <div className="text-xs text-gray-600">Credits</div>
                      </div>
                      
                      <button
                        onClick={() => handleAcceptTask(task.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap"
                      >
                        Accept Task
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">How to Complete a Task</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Accept a task and navigate to the location</li>
              <li>Take clear photos as per the checklist</li>
              <li>Fill in the verification form with your observations</li>
              <li>Submit and earn credits within 24 hours!</li>
            </ol>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
