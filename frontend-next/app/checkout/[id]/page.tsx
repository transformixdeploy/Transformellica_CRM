"use client";

import React, { useContext } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { plans } from '@/lib/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { authenticatePageUseEffect } from '@/utilities/authenticatePageUseEffect';

interface Props {
  params: {
    id: string;
  };
}

const CheckoutPage = ({ params }: Props) => {

  const router = useRouter();    
  const {user, isAuthenticated, isLoading, accessToken} = useContext(AuthContext);

  authenticatePageUseEffect(!isAuthenticated, isLoading, router);

  const plan = plans.find(plan => plan.id === params.id)!;
  
  if(user || isLoading){
    return;
  }

  return (

    // Main container
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black text-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] bg-clip-text text-transparent">
            Confirm Your Plan
          </h1>
          <p className="mt-3 text-gray-400 text-lg">Review your selection and proceed to secure payment</p>
        </div>

        {/* Cards container */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Plan Card - Takes 2/3 */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-1 -right-1">
                  <div className="bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    RECOMMENDED
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <h2 className="text-3xl font-bold text-white mb-2">{plan.name}</h2>
              <p className="text-purple-300 text-sm mb-6">Best for: {plan.bestFor}</p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{plan.priceEGP}</span>
                  <span className="text-xl text-gray-400">EGP</span>
                  <span className="text-gray-500">/ month</span>
                </div>
              </div>

              {/* Highlights */}
              {plan.highlights && 
                <div className="mb-8 p-4 bg-black/30 rounded-xl border border-purple-500/20">
                  <p className="text-sm text-purple-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 mt-0.5 text-[hsl(300,75%,55%)]" />
                    {plan.highlights}
                  </p>
                </div>
              }

              {/* Features */}
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-200">
                    <strong className="text-white">{plan.reports}</strong> AI Reports per month
                  </span>
                </li>

                {plan.history && 
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-200">
                      <strong className="text-white">{plan.history}</strong> History Access
                    </span>
                  </li>
                }

                {plan.modelMemory && 
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-200">
                      AI Model Memory
                    </span>
                  </li>
                }

                {plan.extraReport && 
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-200">
                      Bonus Reports <strong className="text-white">{`(${plan.extraReport} EGP/report)`}</strong> 
                    </span>
                  </li>
                }

                {plan.crm &&
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-200">
                      CRM <strong className="text-white">{plan.crmNote}</strong>
                    </span>
                  </li>
                }

                {plan.support &&
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-200">
                      <strong className="text-white">{plan.support}</strong> Support
                    </span>
                  </li>
                }
                
              </ul>

            </div>
          </div>

          {/* Checkout Summary card - Takes 1/3 */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-b from-purple-900/40 to-black/60 backdrop-blur-md border border-purple-500/40 rounded-2xl p-6 shadow-2xl top-6">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Plan</span>
                  <span className="font-medium text-white">{plan.name}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Billing Cycle</span>
                  <span className="font-medium text-white">Monthly</span>
                </div>

                <div className="h-px bg-purple-500/30 my-4"></div>

                <div className="flex justify-between text-lg">
                  <span className="text-white">Total Due Today</span>
                  <span className="font-bold text-2xl text-white">{plan.priceEGP} EGP</span>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Secure payment • No hidden fees • Cancel anytime
                </p>

                {/* Pay Button */}
                <button
                  onClick={() => {
                    // Redirect to payment gateway
                    window.location.href = `https://payment-gateway.example.com/pay?plan=${plan.id}&amount=${plan.priceEGP}`;
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(300,75%,55%)] text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  Proceed to Payment
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  By proceeding, you agree to our
                  <span className='text-primary font-bold underline'> <Link href={"/privacy-policy"}>Terms of Service</Link> </span>
                  and 
                  <span className='text-primary font-bold underline'> <Link href={"/refund-policy"}>Refund Policy</Link></span>
                  .
                </p>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  )
};

export default CheckoutPage;