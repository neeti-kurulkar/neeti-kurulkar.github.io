import React from 'react';

const ProjectCard = ({ title, description, category, image, tags, github, live }) => {
  const isImage = (str) => {
    return typeof str === 'string' && (str.startsWith('http') || str.startsWith('/'));
  };

  return (
    <div className="font-[Open_Sans] group cursor-pointer">
      {/* Updated image container with a flexible aspect ratio */}
      <div className="bg-[#183D3D] rounded-2xl mb-6 overflow-hidden aspect-video">
        <div className="w-full h-full bg-[#040D12]/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {isImage(image) ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-contain p-4" // Use object-contain and add some padding
            />
          ) : (
            <span className="text-4xl">{image}</span>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-[#D5F0E5]/90">{title}</h3>
          <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">{category}</span>
        </div>
        <p className="text-[#D5F0E5]/65 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs text-[#D5F0E5] bg-[#93B1A6]/30 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4 pt-2">
          {live && (
            <a 
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-medium px-4 py-2 rounded-full bg-[#5C8374] hover:bg-blue-600 transition-colors"
            >
              Visit
            </a>
          )}
          {github && (
            <a 
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 text-sm font-medium px-4 py-2 rounded-full border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;