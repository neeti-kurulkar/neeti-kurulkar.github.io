// src/components/About.jsx

const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#040D12]">
      <div className="max-w-7xl mx-auto">
        <div className="font-[Open_Sans] grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl font-bold text-[#D5F0E5]/85 mb-8">About Me</h3>
            <div className="space-y-6 text-lg text-[#D5F0E5]/65 leading-relaxed">
              <p>
                My journey blends academic learning with real-world innovation. From creating CodeMorph—
                an agentic AI system for legacy code migration—to building a disaster resilience platform 
                powered by IBM Cloud, I thrive on solving meaningful problems with technology.
              </p>
              <p>
                I enjoy working across the stack, combining Python, JavaScript, and emerging AI tools. 
                I believe technology is most powerful when it’s accessible, engaging, and impactful.
              </p>
              <p>
                Beyond coding, I see myself as a problem-solver who learns by doing. I’m always looking 
                for ways to push boundaries and create solutions that matter. I also hold a B1 proficiency 
                in German, expanding my ability to collaborate and engage in multicultural environments.
              </p>

            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-[#D5F0E5]/85 mb-4">Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                {["Python", "SQL", "FastAPI", "Streamlit", "LangChain", "Autogen", "IBM Cloud", "Azure", "Databricks", "PostgreSQL"].map((skill, index) => (
                  <div key={index} className="bg-[#183D3D]/40 p-4 rounded-lg text-center font-medium text-[#D5F0E5]/85">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;