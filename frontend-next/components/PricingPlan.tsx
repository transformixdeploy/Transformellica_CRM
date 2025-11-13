'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { BadgeCheck, BarChart3, CircleAlert, CircleX } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { plans, historyTypes, supportTypes } from '@/lib/constants';

const USD_RATE = 47.2;

function CheckIcon(){
  return (
    <BadgeCheck className="h-5 w-5 flex-shrink-0 text-green-500" />
  )
}

function AlertIcon(){
  return (
    <CircleAlert className="h-5 w-5 flex-shrink-0 text-yellow-500" />
  )
}

function CrossIcon(){
  return (
    <CircleX className="h-5 w-5 flex-shrink-0 text-red-500" />
  )
}

export default function PricingPlan() {
  return (
    <section className="container mx-auto px-4 py-16">
      
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="mx-auto max-w-5xl text-4xl font-extrabold leading-tight text-gray-900 dark:text-white md:text-5xl">
          Be among the first to try{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Transformellica
          </span>
          . Join the waitlist for exclusive early access — or skip the line and unlock everything today.
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Selected waitlist members will enjoy a free premium trial during our early access phase.{' '}
          <span className="font-bold underline">
            Prefer instant access?
          </span>
          {' '} Subscribe now and start using it immediately.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        
        {plans.map((plan, i) => {
          const isFree = plan.name.includes('Free');
          const priceUSD = plan.priceEGP ? (plan.priceEGP / USD_RATE).toFixed(2) : null;

          return (
            // Card
            <div
              key={i}
              className={clsx(
                'relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all',
                'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border shadow-lg hover:shadow-xl',
                plan.recommended && 'ring-2 ring-indigo-500 ring-offset-2',
                'hover:-translate-y-1'
              )}
            >
              {/* Recommended Ribbon */}
              {plan.recommended && (
                <div className="absolute -right-10 top-6 w-40 rotate-45 bg-gradient-to-r from-indigo-500 to-purple-600 py-1 text-center text-xs font-semibold text-white">
                  RECOMMENDED
                </div>
              )}

              {/* Header */}
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                  {plan.inviteOnly && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      invite required
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{plan.bestFor}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.priceEGP ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      {plan.priceEGP} EGP
                    </span>
                    <span className="text-lg text-gray-500">/ ${priceUSD}</span>
                  </div>
                ) : (
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                  </p>
                )}
              </div>

              {/* Features List */}
              <ul className="mb-6 flex-1 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                
                {/* Reports */}
                <li className="flex items-center gap-2">
                  <CheckIcon/>
                  <span>{plan.reports} reports</span>
                </li>

                {/* History */}
                <li className="flex items-center gap-2">
                  {plan.history === historyTypes.limited ? <AlertIcon/> : <CheckIcon/> }
                  <span>History: {plan.history}</span>
                </li>

                {/* Memory */}
                <li className="flex items-center gap-2">
                  {plan.modelMemory ? <CheckIcon/> : <CrossIcon/>}
                  <span>Model Memory</span>
                </li>

                {/* CRM */}
                <li className="flex items-center gap-2">
                  {plan.crm ? <CheckIcon/> : <CrossIcon/>}
                  <span>CRM {plan.crm && plan.crmNote}</span>
                </li>

                {/* extra report */}
                <li className="flex items-center gap-2">
                  {plan.extraReport ? <CheckIcon/> : <CrossIcon/>}
                  <span>Extra Reports{plan.extraReport && `: ${plan.extraReport} EGP/report`}</span>
                </li>

                {/* Support */}
                <li className="flex items-center gap-2">
                  {plan.support ? (plan.support === supportTypes.standard ? <AlertIcon/> : <CheckIcon/> ) : <CrossIcon/> }
                  <span>Support {plan.support && `: ${plan.support}`}</span>
                </li>

              </ul>

              {/* Highlights */}
              {plan.highlights && (
                <p className="mb-6 text-xs italic text-gray-500 dark:text-gray-400">
                  {plan.highlights}
                </p>
              )}

              {/* CTA Button */}
              {isFree ? 
                // This button 
                <Button
                  variant={'outline'}
                  key={plan.name}
                  onClick={()=>{}}
                  className={clsx(
                    'mt-auto w-full cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300'
                  )}
                >
                Join Waitlist
                </Button> :
                <Link href={`/checkout/${plan.id}`}>
                  <Button
                    variant={'default'}
                    key={plan.name}
                    className={clsx(
                      'mt-auto w-full cursor-pointer',
                      plan.recommended
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    )}
                  >
                    Choose Plan
                  </Button>
                </Link>
              }
            </div>
          );
        })}
      </div>
    </section>
  );
}