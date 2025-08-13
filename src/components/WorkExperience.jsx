// src/components/WorkExperience.jsx

const WorkExperience = () => {
  const experiences = [
    {
      company: "ACM Student Chapter",
      role: "Technical Lead",
      period: "January 2024 - Present",
      description: {
        1: "Leading the technical team in organizing hands-on workshops and events to enhance members' skills.",
        2: "Planned and executed large-scale events, including a 12-hour citywide hackathon and a 30-day nationwide DSA challenge with 450+ participants."
      }
    },
    {
      company: "Plural Technology Pvt. Ltd.",
      role: "Software Engineer Intern",
      period: "December 2024 - February 2025",
      description: {
        1: "Worked with the AIML team to build an AI-powered virtual assistant with facial and speech recognition using TensorFlow/Keras, FastAPI, and custom multilingual models for improved transliteration and speech accuracy.",
        2: "Designed a 3D interactive interface using React.js, Three.js, and Blender to enable real-time user interaction and access automation."
      }
    }
  ];

  return (
    <section className="font-[Open_Sans] py-16 px-4 sm:px-6 lg:px-8 bg-[#040D12]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#D5F0E5]/85 mb-6">Experience</h2>
        </div>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-[#183D3D]/40 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#D5F0E5]/85">{exp.role}</h3>
                  <p className="text-lg text-[#5C8374] font-medium">{exp.company}</p>
                </div>
                <span className="text-gray-400 mt-2 md:mt-0">{exp.period}</span>
              </div>
              {/* Updated section for the description */}
              <ul className="list-disc list-inside space-y-2 text-[#D5F0E5]/75 leading-relaxed">
                {Object.values(exp.description).map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;