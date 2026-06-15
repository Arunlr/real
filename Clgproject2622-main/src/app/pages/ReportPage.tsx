import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TrustScore } from '../components/TrustScore';
import { ImageCarousel } from '../components/ImageCarousel';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  User, 
  Star,
  Calendar,
  Download,
  Share2,
  ArrowLeft
} from 'lucide-react';

// Mock data for the report
const mockReportData: Record<string, any> = {
  '1': {
    id: 1,
    placeName: 'Sunrise Grand Hotel',
    city: 'Mumbai',
    address: 'Andheri West, Mumbai, Maharashtra 400053',
    placeType: 'Hotel',
    trustScore: 91,
    verificationDate: '2026-02-10',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzcwNzE0NDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1720540244592-b4124532b318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc3MDYyOTI2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1766928210443-0be92ed5884a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NzA2OTQxODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    verifier: {
      name: 'Priya Sharma',
      rating: 4.9,
      totalVerifications: 203,
      verified: true,
    },
    insights: [
      {
        category: 'Cleanliness',
        status: 'positive',
        comment: 'Immaculate rooms with daily housekeeping. Lobby and common areas spotless.',
      },
      {
        category: 'Amenities',
        status: 'positive',
        comment: 'Swimming pool, gym, spa, and restaurant all functional. WiFi speed tested at 100 Mbps.',
      },
      {
        category: 'Service Quality',
        status: 'positive',
        comment: '24/7 front desk, concierge service excellent. Staff very professional and helpful.',
      },
      {
        category: 'Location',
        status: 'positive',
        comment: '5 minutes from airport. Close to shopping centers and restaurants. Easy metro access.',
      },
      {
        category: 'Actual vs Photos',
        status: 'positive',
        comment: 'Rooms match or exceed photos. Views are as advertised. No discrepancies found.',
      },
      {
        category: 'Value for Money',
        status: 'positive',
        comment: 'Premium pricing justified by excellent facilities and service. Breakfast included.',
      },
    ],
    summary: 'Sunrise Grand Hotel is a premium 5-star property offering excellent service, modern amenities, and convenient location near Mumbai airport. Perfect for business travelers and luxury seekers.',
  },
  '2': {
    id: 2,
    placeName: 'FitZone Premium Gym',
    city: 'Bangalore',
    address: 'Indiranagar, Bangalore, Karnataka 560038',
    placeType: 'Gym',
    trustScore: 88,
    verificationDate: '2026-02-10',
    images: [
      'https://images.unsplash.com/photo-1761971975769-97e598bf526b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmaXRuZXNzJTIwZ3ltJTIwaW50ZXJpb3IlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzcwNzMyNDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBneW0lMjBlcXVpcG1lbnQlMjB3ZWlnaHRzfGVufDF8fHx8MTc3MDczNTk2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1761971975962-9cc397e2ba2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZml0bmVzcyUyMGNlbnRlciUyMGludGVyaW9yfGVufDF8fHx8MTc3MDczNTk2NHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    verifier: {
      name: 'Arun Krishnan',
      rating: 4.7,
      totalVerifications: 156,
      verified: true,
    },
    insights: [
      {
        category: 'Equipment',
        status: 'positive',
        comment: 'State-of-the-art equipment from premium brands. Wide variety of machines and free weights.',
      },
      {
        category: 'Cleanliness',
        status: 'positive',
        comment: 'Equipment cleaned regularly. Changing rooms and showers well-maintained.',
      },
      {
        category: 'Training Staff',
        status: 'positive',
        comment: 'Certified trainers available. Personal training sessions offered. Good expertise.',
      },
      {
        category: 'Amenities',
        status: 'positive',
        comment: 'Steam room, sauna, and smoothie bar available. Lockers and parking provided.',
      },
      {
        category: 'Crowd Levels',
        status: 'warning',
        comment: 'Can get crowded during peak hours (6-9 AM and 6-9 PM). Plan accordingly.',
      },
      {
        category: 'Value for Money',
        status: 'positive',
        comment: 'Premium pricing but justified by facilities. Monthly packages available.',
      },
    ],
    summary: 'FitZone Premium Gym offers top-tier fitness facilities with modern equipment, professional trainers, and excellent amenities. Best suited for serious fitness enthusiasts willing to invest in quality.',
  },
  '3': {
    id: 3,
    placeName: 'ABC PG',
    city: 'Bangalore',
    address: '123 Koramangala, Bangalore, Karnataka 560034',
    placeType: 'PG/Hostel',
    trustScore: 87,
    verificationDate: '2026-02-09',
    images: [
      'https://images.unsplash.com/photo-1767884162402-683fdd430046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBkb3JtaXRvcnklMjBjbGVhbiUyMHJvb218ZW58MXx8fHwxNzcwNzE0MjE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1642130935796-1409d7e075dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcwNTk5MDM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1649522750051-253d25a7d2fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWlnaGJvcmhvb2QlMjBzdHJlZXQlMjByZXNpZGVudGlhbHxlbnwxfHx8fDE3NzA2OTkzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    verifier: {
      name: 'Rajesh Kumar',
      rating: 4.8,
      totalVerifications: 127,
      verified: true,
    },
    insights: [
      {
        category: 'Cleanliness',
        status: 'positive',
        comment: 'Rooms are well-maintained and cleaned daily. Common areas are tidy.',
      },
      {
        category: 'Safety & Security',
        status: 'positive',
        comment: '24/7 security guard present. CCTV cameras installed at all entry points.',
      },
      {
        category: 'Amenities',
        status: 'positive',
        comment: 'WiFi speed tested at 50 Mbps. Hot water available. Laundry service functional.',
      },
      {
        category: 'Nearby Facilities',
        status: 'positive',
        comment: 'Grocery store 100m away. Metro station within 500m. Multiple restaurants nearby.',
      },
      {
        category: 'Actual vs Photos',
        status: 'warning',
        comment: 'Rooms are slightly smaller than advertised photos suggest. Otherwise matches listing.',
      },
      {
        category: 'Noise Levels',
        status: 'positive',
        comment: 'Located in a quiet residential area. Minimal street noise during day and night.',
      },
    ],
    summary: 'ABC PG is a reliable accommodation option with good security and cleanliness standards. The amenities match what is advertised, though rooms are slightly smaller than photos suggest. The location is convenient with good access to public transport and daily necessities.',
  },
};

export function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = mockReportData[id || '1'];

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getInsightIcon = (status: string) => {
    switch (status) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'negative':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white shadow-md group-hover:shadow-lg group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-red-600 transition-all">
              <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
            </div>
            <span className="font-semibold">Back</span>
          </button>

          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.placeName}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {report.address}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Verified on {new Date(report.verificationDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Trust Score */}
          <div className="mb-6">
            <TrustScore score={report.trustScore} />
          </div>

          {/* Image Carousel */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-bold text-xl text-gray-900 mb-4">Verification Photos</h2>
            <ImageCarousel images={report.images} />
          </div>

          {/* AI Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="font-bold text-xl text-gray-900 mb-3">AI Summary</h2>
            <p className="text-gray-700 leading-relaxed">{report.summary}</p>
          </div>

          {/* Detailed Insights */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-bold text-xl text-gray-900 mb-4">Detailed Insights</h2>
            <div className="space-y-4">
              {report.insights.map((insight: any, index: number) => (
                <div key={index} className="border-l-4 border-gray-300 pl-4 py-2">
                  <div className="flex items-center mb-2">
                    {getInsightIcon(insight.status)}
                    <h3 className="font-semibold text-gray-900 ml-2">{insight.category}</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{insight.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verifier Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-bold text-xl text-gray-900 mb-4">Verified By</h2>
            <div className="flex items-start">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                {report.verifier.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h3 className="font-semibold text-gray-900 mr-2">{report.verifier.name}</h3>
                  {report.verifier.verified && (
                    <span title="Verified Local">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{report.verifier.rating}</span>
                  <span className="mx-2">•</span>
                  <User className="w-4 h-4 mr-1" />
                  <span>{report.verifier.totalVerifications} verifications</span>
                </div>
                <p className="text-sm text-gray-600">
                  Trusted local verifier with extensive experience in the {report.city} area.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/request')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Request Another Verification
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}