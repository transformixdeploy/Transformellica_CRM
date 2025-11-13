import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] bg-clip-text text-transparent">
          About Us
        </h1>

        {/* Welcome Section */}
        <section className="space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            Welcome to Transformellica
          </h2>
          <p>
            We’re not just another tech company we’re the bridge between innovation and execution. Transformellica was founded with one mission: to help businesses leverage AI, automation, and digital transformation without the complexity that usually comes with it.
          </p>
          <p>
            We believe that technology should serve people, not replace them. That’s why our team of engineers, data scientists, and strategists focuses on creating intelligent systems that drive measurable business growth.
          </p>
        </section>

        {/* Focus Areas */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            Our Focus Areas
          </h2>
          <ul className="space-y-4 text-lg md:text-xl">
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>
                <strong>AI-Powered Solutions:</strong> Intelligent systems that simplify decision-making.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>
                <strong>Business Automation:</strong> Streamlining operations through data and workflows.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>
                <strong>Digital Growth:</strong> Helping companies scale faster with smarter marketing and technology.
              </span>
            </li>
          </ul>
        </section>

        {/* Vision */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            Our Vision
          </h2>
          <p className="text-lg md:text-xl leading-relaxed">
            To make AI and digital transformation accessible to every business big or small ,across the MENA region and beyond.
          </p>
        </section>

        {/* Values */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            Our Values
          </h2>
          <ul className="space-y-3 text-lg md:text-xl">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[hsl(300,75%,55%)] rounded-full"></span>
              <span>Transparency in every process</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[hsl(300,75%,55%)] rounded-full"></span>
              <span>Integrity in every partnership</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[hsl(300,75%,55%)] rounded-full"></span>
              <span>Innovation in every product</span>
            </li>
          </ul>
        </section>

        {/* Closing Statement */}
        <p className="text-lg md:text-xl italic text-center text-gray-300 mt-12">
          At Transformellica, we don’t just build technology — we transform potential into performance.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;