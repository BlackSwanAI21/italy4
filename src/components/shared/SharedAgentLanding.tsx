import React from 'react';
import { Zap, Target, Calendar, Cog, ArrowRight } from 'lucide-react';
import { Button } from '../Button';
import { useTheme } from '../../lib/theme-context';

interface SharedAgentLandingProps {
  agentName: string;
  onGetStarted: () => void;
}

export function SharedAgentLanding({ agentName, onGetStarted }: SharedAgentLandingProps) {
  const { customColors } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Logo Section */}
        {customColors.logo && (
          <div className="flex justify-center mb-12">
            <img
              src={customColors.logo}
              alt="Company logo"
              className="h-16 object-contain"
            />
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Meet Your AI Assistant: <span className="text-indigo-600">{agentName}</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Experience the future of AI Sales Agents with our intelligent assistant, ready to engage and convert leads 24/7
          </p>
          <div className="mt-8">
            <Button onClick={onGetStarted} className="text-lg px-8 py-3">
              Start Chatting Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Speed to Lead Feature */}
          <div className="bg-white rounded-xl shadow-md p-6 transform transition-transform hover:scale-105">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-indigo-100 rounded-lg p-3">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Instant Lead Response
              </h3>
            </div>
            <p className="text-gray-600">
              Maximize your conversion rates with lightning-fast lead engagement. Our AI Sales Agent 
              responds instantly to inquiries, ensuring no opportunity slips through the cracks, 
              24 hours a day, 7 days a week.
            </p>
          </div>

          {/* Lead Grading Feature */}
          <div className="bg-white rounded-xl shadow-md p-6 transform transition-transform hover:scale-105">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-emerald-100 rounded-lg p-3">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Smart Lead Grading
              </h3>
            </div>
            <p className="text-gray-600">
              Optimize your sales team's efficiency with our sophisticated Bronze, Silver & Gold 
              lead grading system. Focus your energy on the hottest prospects while nurturing 
              every lead to its full potential.
            </p>
          </div>

          {/* Scheduling Feature */}
          <div className="bg-white rounded-xl shadow-md p-6 transform transition-transform hover:scale-105">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Automated Scheduling
              </h3>
            </div>
            <p className="text-gray-600">
              Never miss a hot lead again. Our AI expertly qualifies and schedules callbacks, 
              or instantly transfers engaged prospects to your sales team when they're ready 
              to take action.
            </p>
          </div>

          {/* Custom Goals Feature */}
          <div className="bg-white rounded-xl shadow-md p-6 transform transition-transform hover:scale-105">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <Cog className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Goal-Driven Conversion
              </h3>
            </div>
            <p className="text-gray-600">
              From completing purchases to document collection, our AI Sales Agent drives 
              conversions across every step of your sales process. Experience automated 
              excellence that delivers results.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience The Future of AI Sales Agents?
          </h2>
          <p className="text-gray-600 mb-8">
            Join industry leaders who have revolutionized their sales process with our AI Sales Agent.
          </p>
          <Button onClick={onGetStarted} className="text-lg px-8 py-3">
            Begin Your Conversation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}