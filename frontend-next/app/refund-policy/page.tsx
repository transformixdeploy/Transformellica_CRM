import React from 'react';

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] bg-clip-text text-transparent">
          Refund & Cancellation Policy
        </h1>

        {/* Effective Date */}
        <p className="text-center text-sm md:text-base text-gray-400 uppercase tracking-wider">
          Effective Date: November 2025
        </p>

        {/* Introduction */}
        <section className="space-y-6 text-lg md:text-xl leading-relaxed">
          <p>
            At Transformellica, we believe in transparency and flexibility. Our subscription and service model is designed to give you full control — without the stress of hidden fees or locked contracts.
          </p>
        </section>

        {/* Refund Policy */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            Refund  Refund Policy
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            We do not provide refunds once a billing cycle has been charged, as our services begin immediately upon payment. However, you can cancel your plan at any time before the next billing cycle.
          </p>
        </section>

        {/* Cancellation Policy */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            Cancellation Policy
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            You can cancel your subscription anytime through your account dashboard or by contacting{' '}
            <a
              href="mailto:support@transformellica.com"
              className="text-[hsl(300,75%,55%)] underline hover:text-[hsl(260,80%,60%)] transition-colors"
            >
              support@transformellica.com
            </a>
            .
          </p>
          <p className="text-lg md:text-xl text-gray-200">
            Once canceled, you will not be charged on the next cycle day, and your account access will remain active until the end of the current period.
          </p>
        </section>

        {/* Transparency Promise */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(260,80%,60%)]">
            Transparency Promise
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            We’re committed to clear communication and fair use. There are no cancellation fees, penalties, or hidden terms ever.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicyPage;