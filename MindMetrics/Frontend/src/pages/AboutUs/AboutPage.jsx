import React, { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="bg-[#78ACF1] min-h-screen py-10 px-5 flex flex-col items-center font-poppins">
      <div className="max-w-3xl w-full mt-10 mb-10 py-8 px-8 bg-[#f0f8ff] rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800 mb-6">About Us</p>
          <p className="text-lg font-semibold leading-relaxed text-gray-700 mb-8">
            Welcome to our mental health chat assistant platform. MindMetrics leverages the power of Natural Language Processing (NLP) and machine learning techniques to create a conversational AI capable of understanding user emotions, identifying potential areas of concern, and providing supportive guidance and resources. We are a team of three who have developed this platform as part of our Data Science project:
            <br/><br/>
            Ayush Pandey – 22BCE3956
            <br/>
            Maanav R Vora – 22BCE3957
            <br/>
            Vaibhav Prasad – 22BCE3301
          </p>
        </div>
      </div>
    </div>
  );
}