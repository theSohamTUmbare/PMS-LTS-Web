import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-slate-900 text-white py-16 px-6 sm:px-12 flex flex-col items-center justify-center min-h-[60vh]">
      {/* Background Image with Overlay */}
      {/* <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('/path-to-background-image.jpg')" }} /> */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-transparent opacity-80"></div>

      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Prisoner Management and Live Tracking System
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-light mb-6">
          Enhancing security and monitoring with real-time tracking and effective prisoner management.
        </p>
        
        <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-yellow-500 text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition duration-200">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
