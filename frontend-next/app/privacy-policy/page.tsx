import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        {/* Effective Date */}
        <p className="text-center text-sm md:text-base text-gray-400 uppercase tracking-wider">
          Effective Date: November 2025
        </p>

        {/* Introduction */}
        <section className="space-y-6 text-lg md:text-xl leading-relaxed">
          <p>
            At Transformellica, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you interact with our website and services.
          </p>
        </section>

        {/* 1. Information We Collect */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            1. Information We Collect
          </h2>
          <ul className="space-y-3 text-lg md:text-xl text-gray-200">
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>Personal details (name, email, phone number, company name) provided through forms or sign-ups.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>Technical data (browser type, device, IP address) for performance and analytics.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>Usage data (pages visited, time spent) to improve user experience.</span>
            </li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            2. How We Use Your Information
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            We use collected data to:
          </p>
          <ul className="space-y-3 text-lg md:text-xl text-gray-200">
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>Provide and personalize our services.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>Communicate updates, offers, or technical notices.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>Enhance platform security and performance.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[hsl(300,75%,55%)] mt-1">•</span>
              <span>Comply with applicable legal obligations.</span>
            </li>
          </ul>
        </section>

        {/* 3. Data Protection */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            3. Data Protection
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            We apply strict security measures, encryption, and access control to protect your personal information from unauthorized access or misuse.
          </p>
        </section>

        {/* 4. Sharing Your Information */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            4. Sharing Your Information
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            We never sell your data. We may share limited information only with trusted service providers (such as analytics or hosting partners) to deliver our services efficiently.
          </p>
        </section>

        {/* 5. Your Rights */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            5. Your Rights
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            You have the right to access, update, or delete your personal data at any time. You can contact us at{' '}
            <a
              href="mailto:support@transformellica.com"
              className="text-[hsl(300,75%,55%)] underline hover:text-[hsl(260,80%,60%)] transition-colors"
            >
              support@transformellica.com
            </a>{' '}
            for any privacy-related requests.
          </p>
        </section>

        {/* 6. Updates to This Policy */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            6. Updates to This Policy
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            Transformellica may update this policy periodically. The latest version will always be available on this page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;