// src/components/Projects.jsx
import ProjectCard from './ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: "CodeMorph",
      description: "Agentic AI system using four Autogen agents—Strategist, Migrator, Tester, and Documenter—to automate legacy code migration. Ingests GitHub repositories, generates migration plans, modernizes codebases, and validates results through a Streamlit-based interface. Won 1st Place at The Better Hack.",
      category: "AI & Automation",
      image: "/src/assets/codemorph.png",
      tags: ["Python", "Autogen", "GitIngest", "Streamlit"],
      github: "https://github.com/adv-11/TheBetterHack-2025"
    },
    {
      title: "Disaster Resilience Platform",
      description: "Cross-platform disaster management system with a Streamlit dashboard and Android app for SOS alerts, geospatial mapping, and donation tracking. Powered by IBM Cloud services for risk analysis, live updates, and AI-driven insights. Ranked Top 10 at IBM Hackathon Maharashtra.",
      category: "Civic Tech",
      image: "/src/assets/disaster-resilience.png",
      tags: ["Python", "Java", "Streamlit", "IBM Cloud", "Watsonx.ai", "Cloudant", "NLU"],
      github: "https://github.com/adv-11/Disaster_Resilience_Platform",
      live: "https://disaster-platform-ibm.streamlit.app/"
    },
    {
      title: "Sansthaein Aur Samvidhan",
      description: "Gamified platform simplifying the Indian Constitution through interactive games on governance. Built with Blender, Unreal Engine, PostgreSQL, and an AI speech-enabled guide. Finalists at Smart India Hackathon 2024, ranked 6th out of 500+ entries by the Ministry of Law & Justice.",
      category: "EdTech & Gaming",
      image: "/src/assets/game-pr.png",
      tags: ["C++", "Python", "React.js", "Blender", "Unreal Engine", "ConvAI", "PostgreSQL"],
      live: "https://www.youtube.com/watch?v=txhCER6uMyA",
    },
    {
      title: "Cold Email Generator",
      description: "Generates personalized internship request emails usiing LangChain, Llama 3, ChromaDB, and Streamlit based on job postings and student portfolios, automating the outreach process efficiently..",
      category: "NLP",
      image: "/src/assets/cold-email-generator.png",
      tags: ["LangChain", "Llama 3", "RAG", "Streamlit"],
      github: "https://github.com/neeti-kurulkar/cold-email-generator"
    },
    {
      title: "Question Answer Website",
      description: "A web-based Question-Answer platform for college students, built with FastAPI, MySQL, and a responsive UI using HTML, CSS, and JavaScript.",
      category: "Web Development",
      image: "/src/assets/qna-website.png",
      tags: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/neeti-kurulkar/mconnect-qna-website"
    }
  ];

  return (
    <section id="work" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#040D12]">
      <div className="font-[Open_Sans] max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#D5F0E5]/85 mb-6">Projects</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;