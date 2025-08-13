// src/components/Contact.jsx

const Contact = () => {
  return (
    <section id="contact" className="font-[Open_Sans] py-20 px-4 sm:px-6 lg:px-8 bg-[#040D12]">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-4xl font-bold text-[#D5F0E5]/85 mb-8">Let's Work Together</h3>
        <p className="text-xl text-[#D5F0E5]/75 mb-12 max-w-3xl mx-auto">
          I'm always interested in discussing new projects, creative ideas, 
          or opportunities to be part of your team.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12">
          <a 
            href="mailto:neetikurulkar@gmail.com"
            className="flex items-center text-[#5C8374] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            neetikurulkar@gmail.com
          </a>
          
          <a 
            href="https://www.linkedin.com/in/neeti-kurulkar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#5C8374] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
          
          <a 
            href="https://github.com/neeti-kurulkar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#5C8374] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.043-1.61-4.043-1.61-.546-1.38-1.332-1.745-1.332-1.745-1.088-.745.082-.73.082-.73 1.205.085 1.838 1.238 1.838 1.238 1.07 1.835 2.809 1.305 3.493 1.002.108-.778.418-1.305.762-1.605-2.665-.3-5.462-1.332-5.462-5.945 0-1.31.465-2.38 1.235-3.22-.135-.303-.535-1.52.125-3.175 0 0 1.005-.322 3.3 1.23.957-.265 1.985-.4 3.013-.405 1.028 0 2.056.135 3.012.405 2.29-1.552 3.297-1.23 3.297-1.23.66 1.655.26 2.872.125 3.175.77.84 1.235 1.91 1.235 3.22 0 4.622-2.8 5.645-5.475 5.94.42.36.81 1.096.81 2.22 0 1.606-.015 2.898-.015 3.286 0 .318.22.69.825.57C20.565 21.794 24 17.29 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;