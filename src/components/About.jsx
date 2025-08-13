// src/components/About.jsx

const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#040D12]">
      <div className="max-w-7xl mx-auto">
        <div className="font-[Open_Sans] grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl font-bold text-[#D5F0E5]/85 mb-8">About Me</h3>
            <div className="space-y-6 text-lg text-[#D5F0E5]/65 leading-relaxed">
              <p>I am of the belief that technology is a powerful enabler 
                for solving real-world problems and driving business success. From creating 
                CodeMorph—an agentic AI system that streamlines legacy code migration—to 
                developing a disaster resilience platform, I aim to build innovative 
                solutions that have a tangible impact.
              </p>
              <p>I enjoy working using emerging AI tools to create robust and scalable applications. 
                My focus is on developing solutions that are not only technologically advanced but 
                also intuitive, accessible, and aligned with business goals.
              </p>
              <p>Beyond coding, I'm a hands-on problem-solver dedicated to continuous learning. 
                I am always seeking new challenges to push the boundaries of what's possible and create 
                solutions that matter. I also hold a B1 proficiency in German, which enhances my ability 
                to collaborate effectively in diverse, multicultural environments.
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