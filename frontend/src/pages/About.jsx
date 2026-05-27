import React from 'react';

function About() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">About PassPredict</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Empowering educators and students with predictive analytics.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass-panel p-8">
          <h3 className="text-2xl font-bold mb-4 text-purple-300">Our Mission</h3>
          <p className="text-gray-300 leading-relaxed">
            Our goal is to identify students who are at risk of failing early in the academic year. By utilizing machine learning algorithms, we analyze a multitude of factors ranging from study habits to lifestyle choices, providing actionable insights to foster student success.
          </p>
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-2xl font-bold mb-4 text-purple-300">How It Works</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            PassPredict is powered by a robust Random Forest classification model. The system evaluates 19 distinct data points across 4 categories:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Academic Information:</strong> Study hours, attendance, previous exam scores, assignment completion.</li>
            <li><strong>Lifestyle:</strong> Sleep patterns, screen time, social media usage.</li>
            <li><strong>Behavioral:</strong> Stress levels, motivation, participation.</li>
            <li><strong>Environment:</strong> Internet access, family support, study environment.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
