import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Info, PhoneCall, ShieldAlert, BookOpen, Send, 
  MapPin, CheckCircle, Camera, Award, ChevronRight, HelpCircle 
} from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();
  const [activeModalTab, setActiveModalTab] = useState<'how-it-works' | 'about' | 'contact' | 'privacy' | null>(null);
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Verification Help');
  const [contactMsg, setContactMsg] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) {
      alert("Please fill in all the required fields.");
      return;
    }
    
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccess(true);
      setTimeout(() => {
        setContactSuccess(false);
        // Clear inputs after submission
        setContactName('');
        setContactEmail('');
        setContactMsg('');
        setActiveModalTab(null);
      }, 2500);
    }, 1500);
  };

  const handleFooterLinkClick = (e: React.MouseEvent, tab: 'how-it-works' | 'about' | 'contact' | 'privacy') => {
    e.preventDefault();
    setActiveModalTab(tab);
    setContactSuccess(false);
  };

  return (
    <footer className="bg-gray-950 text-gray-300 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-black text-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              LOCALS.COM
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's trust-verified physical location and property network. Bridging decentralized live photography with verified GPS coordinates.
            </p>
          </div>
          
          {/* Platform category */}
          <div>
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a 
                  href="#how-it-works"
                  onClick={(e) => handleFooterLinkClick(e, 'how-it-works')} 
                  className="hover:text-blue-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  How it Works <span className="text-[10px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase">Guide</span>
                </a>
              </li>
              <li><Link to="/rewards" className="hover:text-amber-400 transition-colors block">Pricing & Rewards</Link></li>
              <li><Link to="/trust-safety" className="hover:text-pink-400 transition-colors block">Trust & Safety Core</Link></li>
              <li><Link to="/nearby" state={{ mapMode: true }} className="hover:text-cyan-400 transition-colors block text-gray-405 font-medium">Interactive Map View</Link></li>
            </ul>
          </div>
          
          {/* For Locals category */}
          <div>
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider mb-5">For Locals</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/local/signup" className="hover:text-indigo-400 transition-colors font-bold text-indigo-400 flex items-center gap-1.5">
                  Become a Verifier <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                </Link>
              </li>
              <li><Link to="/verifier/dashboard" className="hover:text-cyan-400 transition-colors block text-cyan-300">Earnings Dashboard</Link></li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => handleFooterLinkClick(e, 'how-it-works')} 
                  className="hover:text-pink-400 transition-colors block text-pink-300"
                >
                  Verifier Guidelines
                </a>
              </li>
              <li><Link to="/verifier/dashboard" className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400 block">Open Gigs Board</Link></li>
            </ul>
          </div>
          
          {/* Company links */}
          <div>
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleFooterLinkClick(e, 'about')} 
                  className="hover:text-cyan-400 transition-colors block cursor-pointer"
                >
                  About us
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => handleFooterLinkClick(e, 'contact')} 
                  className="hover:text-emerald-400 transition-colors block cursor-pointer"
                >
                  Contact support
                </a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  onClick={(e) => handleFooterLinkClick(e, 'privacy')} 
                  className="hover:text-purple-400 transition-colors block cursor-pointer"
                >
                  Privacy Policy & GPS
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800/80 mt-12 pt-8 text-sm text-center text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 LOCALS.COM network. Built on encrypted proof of presence.</p>
          <div className="flex gap-4">
            <Link to="/diagnostics" className="text-xs hover:text-gray-300 text-gray-500 underline decoration-slate-700">Camera Checks</Link>
            <span className="text-gray-700">•</span>
            <Link to="/diagnostics-full" className="text-xs hover:text-gray-300 text-gray-500 underline decoration-slate-700">Terminal API</Link>
          </div>
        </div>
      </div>

      {/* Polish Tabbed Overlays Modal */}
      <AnimatePresence>
        {activeModalTab !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalTab(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-3xl w-full bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col max-h-[85vh]"
            >
              {/* Header Navigation */}
              <div className="flex bg-slate-950 px-6 py-4 items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3 overflow-x-auto select-none no-scrollbar py-1">
                  <button
                    onClick={() => setActiveModalTab('how-it-works')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      activeModalTab === 'how-it-works' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    How It Works
                  </button>
                  <button
                    onClick={() => setActiveModalTab('about')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      activeModalTab === 'about' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    About Us
                  </button>
                  <button
                    onClick={() => setActiveModalTab('contact')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      activeModalTab === 'contact' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    Contact
                  </button>
                  <button
                    onClick={() => setActiveModalTab('privacy')}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      activeModalTab === 'privacy' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Privacy & GPS
                  </button>
                </div>
                
                <button
                  onClick={() => setActiveModalTab(null)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all ml-4 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Box */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 font-sans">
                {/* 1. HOW IT WORKS TAB */}
                {activeModalTab === 'how-it-works' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2 select-none">
                        <BookOpen className="text-blue-400 w-5 h-5" />
                        Decentralized Location Verification Protocol
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">Learn how the state of presence is securely locked in real time.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">1</div>
                        <h4 className="text-white font-bold text-sm">Request Coords Action</h4>
                        <p className="text-gray-400 text-xs">Users submit requests identifying a target hotel, school, pg, or local spot requiring trusted physical confirmation.</p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">2</div>
                        <h4 className="text-white font-bold text-sm">Go-on-Ground Accept</h4>
                        <p className="text-gray-400 text-xs">Locals in physical proximity view pending tasks nearby and claim assignments directly on their gigs board.</p>
                      </div>

                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">3</div>
                        <h4 className="text-white font-bold text-sm">Live Location Shot</h4>
                        <p className="text-gray-400 text-xs">The verifier uses the live integrated camera to take a secure photographic snapshot containing immutable GPS coordinates.</p>
                      </div>

                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">4</div>
                        <h4 className="text-white font-bold text-sm">AI Trust Validation</h4>
                        <p className="text-gray-400 text-xs">The server validates headers, matches latitude boundaries with the listing description, and registers the verified review instantly.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-950 to-indigo-950 rounded-xl border border-blue-500/20 text-center">
                      <h4 className="text-blue-300 text-sm font-bold">Want to earn verifying local addresses?</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-lg mx-auto">Verified tasks earn XP, Level upgrades up to Gold premium tier, and rewards credits redeemable at local partners.</p>
                      <button 
                        onClick={() => {
                          setActiveModalTab(null);
                          navigate('/local/signup');
                        }}
                        className="mt-3 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 mx-auto cursor-pointer"
                      >
                        Join as Verifier <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. ABOUT US TAB */}
                {activeModalTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2 select-none">
                        <Info className="text-cyan-400 w-5 h-5" />
                        Decentralized Trust Network
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">Bridging digital listings with physically verified truth.</p>
                    </div>

                    <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-sans">
                      <p>
                        <strong className="text-white">LOCALS.COM</strong> is a next-generation decentralized physical verification platform allowing immediate crowd-sourced verification of businesses, properties, residential infrastructure, ladies' safe PGs, and schools.
                      </p>
                      <p>
                        Traditional review platforms have become plagued by fake, simulated ratings written by remote marketing bots. On LOCALS.COM, <span className="text-cyan-400 font-semibold">on-site physical presence</span> is a hardware mandate. For any review to gain a "Verified" status, we authenticate the GPS accuracy, heading data, and capture devices in real-time.
                      </p>

                      <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                        <div className="p-3.5 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-2xl font-black text-cyan-400">12,400+</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold mt-1">Verified spots</p>
                        </div>
                        <div className="p-3.5 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-2xl font-black text-emerald-400">99.8%</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold mt-1">GPS Accuracy</p>
                        </div>
                        <div className="p-3.5 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-2xl font-black text-indigo-400">₹4.5L+</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold mt-1">Paid to Verifiers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CONTACT TAB */}
                {activeModalTab === 'contact' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2 select-none">
                        <PhoneCall className="text-emerald-400 w-5 h-5" />
                        Submit Secure Ticket
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">Need help with verifier payout credits, profile lockouts, or location audits?</p>
                    </div>

                    {contactSuccess ? (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3"
                      >
                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                        <h4 className="text-emerald-300 font-bold text-lg">Support Request Received!</h4>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto">Thank you for submitting your ticket. A support engineer will audit your request within 24 hours.</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
                            <input
                              type="text"
                              required
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="Enter your name"
                              className="w-full bg-slate-950 border border-white/15 px-4 py-3 rounded-xl text-white text-sm focus:ring-1 focus:ring-emerald-500/50 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Email</label>
                            <input
                              type="email"
                              required
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="you@domain.com"
                              className="w-full bg-slate-950 border border-white/15 px-4 py-3 rounded-xl text-white text-sm focus:ring-1 focus:ring-emerald-500/50 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject Category</label>
                          <select
                            value={contactSubject}
                            onChange={(e) => setContactSubject(e.target.value)}
                            className="w-full bg-slate-950 border border-white/15 px-4 py-3 rounded-xl text-white text-sm focus:ring-1 focus:ring-emerald-500/50 focus:outline-none cursor-pointer"
                          >
                            <option value="Verification Help">Payout and Rewards Credits</option>
                            <option value="Become a Partner">Integration with Business/Listing</option>
                            <option value="Bug Report">GPS Hardware/Camera Error</option>
                            <option value="Legal">Privacy / Geolocation Dispute</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Description</label>
                          <textarea
                            required
                            rows={3}
                            value={contactMsg}
                            onChange={(e) => setContactMsg(e.target.value)}
                            placeholder="Detail your request or the specific task ID you are inquiring about..."
                            className="w-full bg-slate-950 border border-white/15 px-4 py-3 rounded-xl text-white text-sm focus:ring-1 focus:ring-emerald-500/50 focus:outline-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingContact}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          {isSubmittingContact ? 'Transmitting Ticket...' : 'Send Secure Message'}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 4. PRIVACY TAB */}
                {activeModalTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2 select-none">
                        <ShieldAlert className="text-purple-400 w-5 h-5" />
                        Geolocation Privacy & EXIF Metadata safe policy
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">We enforce strong data minimization for on-the-ground verifications.</p>
                    </div>

                    <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed font-sans max-h-[40vh] overflow-y-auto pr-2 border-t border-slate-800 pt-4">
                      <p className="font-bold text-white uppercase tracking-wider">🔒 Hardware Encrypted Identity</p>
                      <p>
                        We do not collect permanent, background location coordinates. LOCALS.COM only queries the device sensor when the photographer has actively triggered a "Verify Room" or "Verify Location" action.
                      </p>
                      <p className="font-bold text-white uppercase tracking-wider">📌 Accurate Boundary Buffer</p>
                      <p>
                        In order to ensure maximum privacy, verifiers can opt to randomize exact GPS accuracy within a 15-meter bubble. This ensures properties match descriptions perfectly while protecting specific coordinate fingerprints of individual cameras.
                      </p>
                      <p className="font-bold text-white uppercase tracking-wider">📸 Metadata Clearing</p>
                      <p>
                        All photographs are processed through server-side EXIF cleaning before publishing. This strips information like the specific manufacturer model, aperture details, and personal facial elements of physical verifiers.
                      </p>
                      <p className="font-bold text-white uppercase tracking-wider">📜 Terms of Decentralized Gigs</p>
                      <p>
                        By contributing to LOCALS.COM, you agree to always be physically present within the coordinate boundaries when capturing photos. Automated algorithms detect coordinates spoofs, leading to permanent hardware bans.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
