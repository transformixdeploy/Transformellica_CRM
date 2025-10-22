"use client";

import { brandingAuditData, localStorageDataNames } from '@/lib/constants';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { ReanalyzeButton } from '@/components/ReanalyzeButton';
import { AuthContext } from '@/context/AuthContext';
import { authenticatePageUseEffect } from '@/utilities/authenticatePageUseEffect';
import CheckingUserCard from '@/components/CheckingUserCard';

const BrandingAudit = () => {
    const router = useRouter();

    const [data, setData] = useState(brandingAuditData);

    const {user, isAuthenticated, isLoading} = useContext(AuthContext);

    authenticatePageUseEffect(isAuthenticated, isLoading, router);

    useEffect(() => {
        if (!localStorage.getItem(localStorageDataNames.BRANDING_AUDIT)) {
            return router.push("/");
        }
        setData(JSON.parse(localStorage.getItem(localStorageDataNames.BRANDING_AUDIT)!));
    }, []);

    function handleDeleteAnalysis() {
        localStorage.removeItem(localStorageDataNames.BRANDING_AUDIT);
        router.push("/");
    }

    if(!isAuthenticated){
        return (
          <CheckingUserCard/>
        )
    }else{
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
                <header className="mb-12">
                    <h1 className="text-5xl font-extrabold text-center text-white mb-4">
                        Branding Audit Report
                    </h1>
                    <p className="text-center text-gray-400 text-lg mb-6">
                        {"A comprehensive analysis of your brand's visual identity, messaging, and overall strategy."}
                    </p>
                    <div className="flex justify-center">
                        <ReanalyzeButton onClick={handleDeleteAnalysis}/>
                    </div>
                </header>
    
                {/* Top Images Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {data.websiteImage.data && (
                        <div className="bg-gray-800 rounded-lg shadow-xl p-4 flex flex-col items-center justify-center">
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">Website Screenshot</h2>
                            <img src={`data:${data.websiteImage.mimeType};base64,${data.websiteImage.data}`} alt="Website Screenshot" className="max-w-full h-200 rounded-md" />
                        </div>
                    )}
                    {data.instaImage.data && (
                        <div className="bg-gray-800 rounded-lg shadow-xl p-4 flex flex-col items-center justify-center">
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">Instagram Screenshot</h2>
                            <img src={`data:${data.instaImage.mimeType};base64,${data.instaImage.data}`} alt="Instagram Screenshot" className="max-w-full h-200 rounded-md" />
                        </div>
                    )}
                </section>
    
                {/* Company Branding Profile Used */}
                <section className="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">Company Branding Profile Used</h2>
                        <p className="text-gray-400 mb-2">Logo: Transformix logo .png</p>
                        {data.logoImage.data && (
                            <div className="flex items-center space-x-4">
                                <img src={`data:${data.logoImage.mimeType};base64,${data.logoImage.data}`} alt="Company Logo" className="h-16 w-16 object-contain rounded-sm" />
                                <span className="text-gray-400">Company Logo</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">Brand Colors</h2>
                        {data.brandColors.dominanColor && (
                            <p className="text-gray-400 mb-2">Dominant: <span style={{ color: data.brandColors.dominanColor }}>{data.brandColors.dominanColor}</span></p>
                        )}
                        {data.brandColors.colors.length > 0 && data.brandColors.colors[0] !== "" && (
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold text-gray-200 mb-2">Palette:</h3>
                                <div className="max-sm:grid-cols-2 grid grid-cols-3 flex-wrap gap-2">
                                    {data.brandColors.colors.map((color, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-full border border-gray-600" style={{ backgroundColor: color }}></div>
                                            <span className="text-gray-400">{color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
    
                {/* Executive Summary */}
                <section className="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">Executive Summary</h2>
                    <div className="prose prose-invert text-gray-300 leading-relaxed">
                        <ReactMarkdown>
                            {data.executiveSummary}
                        </ReactMarkdown>
                    </div>
                </section>
    
                {/* Overall Brand Identity & First Impression */}
                <section className="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">Overall Brand Identity & First Impression</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-green-400 mb-4">Strengths</h3>
                            <ul className="list-disc text-gray-300 leading-relaxed space-y-2">
                                {data.overallBrandIdentity_firstImpression.strengths.map((item, index) => (
                                    <li key={index}><ReactMarkdown>{item}</ReactMarkdown></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-red-400 mb-4">Room for Improvement</h3>
                            <ul className="list-disc text-gray-300 leading-relaxed space-y-2">
                                {data.overallBrandIdentity_firstImpression.roomForImprovement.map((item, index) => (
                                    <li key={index}><ReactMarkdown>{item}</ReactMarkdown></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
    
                {/* Visual Branding Elements */}
                <section className="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">Visual Branding Elements</h2>
                    <div className="space-y-10">
                        {/* Color Palette */}
                        <div>
                            <h3 className="text-3xl font-bold text-blue-400 mb-4">Color Palette</h3>
                            <div className="text-gray-300 mb-4">
                                <ReactMarkdown>{data.visualBrandingElements.colorPalette.analysis}</ReactMarkdown>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-200 mb-2">Recommendations:</h4>
                            <ul className="list-disc text-gray-300 leading-relaxed space-y-2">
                                {data.visualBrandingElements.colorPalette.recommendations.map((item, index) => (
                                    <li key={index}><ReactMarkdown>{item}</ReactMarkdown></li>
                                ))}
                            </ul>
                        </div>
                        {/* Typography */}
                        <div>
                            <h3 className="text-3xl font-bold text-blue-400 mb-4">Typography</h3>
                            <div className="text-gray-300 mb-4">
                                <ReactMarkdown>{data.visualBrandingElements.typography.analysis}</ReactMarkdown>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-200 mb-2">Recommendations:</h4>
                            <ul className="list-disc text-gray-300 leading-relaxed space-y-2">
                                {data.visualBrandingElements.typography.recommendations.map((item, index) => (
                                    <li key={index}><ReactMarkdown>{item}</ReactMarkdown></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
    
                {/* Messaging & Content Style */}
                <section className="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">Messaging & Content Style</h2>
                    <div className="text-gray-300 mb-4">
                        <ReactMarkdown>{data.messaging_content_style.content}</ReactMarkdown>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-2">Recommendations:</h4>
                    <ul className="list-disc text-gray-300 leading-relaxed space-y-2">
                        {data.messaging_content_style.recommendations.map((item, index) => (
                            <li key={index}><ReactMarkdown>{item}</ReactMarkdown></li>
                        ))}
                    </ul>
                </section>
    
                {/* Highlights & Stories */}
                <section className="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">Highlights & Stories</h2>
                    <div className="text-gray-300 mb-4">
                        <ReactMarkdown>{data.highlights_stories.analysis}</ReactMarkdown>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-2">Recommendations:</h4>
                    <ul className="list-disc text-gray-300 leading-relaxed space-y-2">
                        {data.highlights_stories.recommendations.map((item, index) => (
                            <li key={index}><ReactMarkdown>{item}</ReactMarkdown></li>
                        ))}
                    </ul>
                </section>
    
                {/* Grid Strategy */}
                <section className="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">Grid Strategy</h2>
                    <div className="text-gray-300 mb-4">
                        <ReactMarkdown>{data.gridStrategy.analysis}</ReactMarkdown>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-2">Recommendations:</h4>
                    <ul className="list-disc text-gray-300 leading-relaxed space-y-2">
                        {data.gridStrategy.recommendations.map((item, index) => (
                            <li key={index}><ReactMarkdown>{item}</ReactMarkdown></li>
                        ))}
                    </ul>
                </section>
    
                {/* Scorecard */}
                <section className="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">Score Card</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {data.scores.map((scoreItem, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200"><ReactMarkdown>{scoreItem.title}</ReactMarkdown></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">{scoreItem.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
    
            </div>
        );
    }

};

export default BrandingAudit;