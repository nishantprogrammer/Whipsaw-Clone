import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import React, { useState, useRef } from 'react';

const Video = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const toggleSound = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  return (
    <section className="relative h-screen bg-black flex items-center justify-center">
      {/* Video Section */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted
          preload="metadata"
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.7) contrast(1.2) saturate(1.1)',
            objectFit: 'cover'
          }}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          {/* Beautiful creative animation - perfect for design studio */}
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
            <div className="text-white/30 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 animate-pulse"></div>
              <p>Video loading...</p>
            </div>
          </div>
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Sound Control Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={toggleSound}
        className="absolute top-24 right-8 p-3 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/30 shadow-lg z-10"
        title={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>

      {/* Optional: Video Description or Title */}
      <div className="relative z-10 text-center text-white/80">
        <p className="text-lg">Experience our work in motion</p>
      </div>
    </section>
  );
};

export default Video;
