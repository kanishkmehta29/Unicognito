import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-blue-600">Unicognito</h3>
            <p className="text-gray-600">Connect, Collaborate, Learn</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600">© {new Date().getFullYear()} Unicognito. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;