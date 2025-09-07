import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, Users, FileText, BarChart3 } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "AI Pre-checks",
      description: "Automated document analysis and compliance checking"
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Reviewer Scoring",
      description: "Structured feedback and scoring system"
    },
    {
      icon: <FileText className="h-8 w-8 text-white" />,
      title: "Audit Trail",
      description: "Complete transparency and accountability tracking"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      title: "Role-based Dashboards",
      description: "Customized views for each role and department"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center mr-3 bg-black">
                <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqlzZBjWwRFYZUkEjX4xpn9HsXaf2kcknTgQ&s"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-xl text-black-600">iCog</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
                How it works
              </a>
              <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
                Features
              </a>
              <Link to="/auth" className="text-gray-700 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
            </nav>

            <Link
              to="/auth"
              className="md:hidden bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10"></div>
          <div className="w-full h-full bg-gray-900"></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className={`max-w-3xl transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Centralized Document & Content Approval
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mt-6 leading-relaxed">
              Compliance · Transparency · Accountability
            </p>
            <p className="text-lg text-gray-300 mt-4 max-w-2xl">
              Streamline your approval workflow with AI-powered pre-checks, 
              structured reviewer scoring, and complete audit trails.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-lg"
              >
                Sign In
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={() => navigate('/auth?demo=marketing')}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all hover:scale-105 animate-pulse"
              >
                Demo as Marketing Dept
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need for document approval
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              From AI-powered pre-checks to comprehensive audit trails, 
              our system handles every aspect of your approval workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 transform duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center mr-3 bg-black">
                <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqlzZBjWwRFYZUkEjX4xpn9HsXaf2kcknTgQ&s"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-xl text-gray-00">iCog</span>
            </div>
            
            <div className="flex space-x-8 text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; 2025 iCog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;