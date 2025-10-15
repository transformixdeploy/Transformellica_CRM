const dashboardTestData = {
    keyBusinessInsights: {
        primaryInsights: [
            "Digital transformation services showing 34% quarter-over-quarter growth with strong client retention rates.",
            "Customer satisfaction scores reached 94% with improved service delivery and faster project completion times."
        ],
        quickStats: [
            {key: "Active Projects", value: "127"},
            {key: "On-Time Delivery", value: "89%"},
            {key: "Monthly Revenue", value: "$2.4M"},
            {key: "Team Members", value: "45"}
        ]
    },
    keyPerformanceMetrics: [
        {number: 847, title: "Monthly Revenue", description: "$847K"},
        {number: 342, title: "Active Clients", description: "342"},
        {number: 14.2, title: "Avg. Project Days", description: "14.2"},
        {number: 4.8, title: "Client Rating", description: "4.8"}
    ],
    businessRecommendations: {
        actionableInsights: [
            "Mobile app projects show highest profit margins (28% vs 22% average). Consider hiring 2-3 additional mobile developers.",
            "Implement automated testing to reduce delivery time by 15% and improve client satisfaction scores.",
            "Cloud migration services demand increasing. Partner with major cloud providers for better margins."
        ],
        nextSteps: [
            "Hire Mobile Developers",
            "Implement DevOps Pipeline",
            "Cloud Partnership Strategy",
            "Client Feedback System"
        ]
    },
    analytics: [
        {name: "Revenue", count: 100, mean: 750000, std: 50000, min: 600000, "25%": 710000, "50%": 755000, "75%": 790000, max: 850000},
        {name: "Client Score", count: 100, mean: 4.5, std: 0.3, min: 3.8, "25%": 4.3, "50%": 4.5, "75%": 4.7, max: 5.0},
        {name: "Delivery Days", count: 100, mean: 15, std: 2.5, min: 10, "25%": 13, "50%": 15, "75%": 17, max: 20}
    ]
};
  
const websiteSWOTTestData = {
    pageSpeedScore: 75,
    internalLinks: 120,
    externalLinks: 45,
    contentInfo: {
        imagesCount: 50,
        imagesMissingAltTage: 5
    },
    pageInfo: {
        title: "My Awesome Website",
        titleLength: 25,
        metaDescription: "This is a great website about various topics and useful information.",
        metaDescriptionLength: 70,
        https: true,
        canonicalUrl: "https://www.myawesomewebsite.com"
    },
    headingStructure: {
        h1Tages: ["Main Heading 1", "Main Heading 2"],
        h2Tages: ["Subheading A", "Subheading B", "Subheading C"],
        h3Tages: ["Detail 1", "Detail 2"],
        h4Tages: [],
        h5Tages: [],
        h6Tages: []
    },
    schemaMarkup: ["Article", "FAQPage"],
    socialLinks: ["Facebook", "Twitter", "LinkedIn"],
    openGraphTags: {
        title: "My Awesome Website",
        description: "Discover awesome content.",
        url: "https://www.myawesomewebsite.com",
        type: "website",
        siteName: "My Awesome Website"
    },
    summary: "This website has good page speed, a healthy number of internal and external links, and a solid content structure. Some alt tags are missing.",
    fullSocialAnalysis: "Detailed analysis of social media presence and engagement across platforms."
};
  
const sentimentTestData = {
    analysisTitle: "Customer Sentiment Analysis for [Your Business Name]",
    competitorsAnalyzedNumber: 3,
    totalReview: 1250,
    avgGoogleRating: 4.5,
    competitorsAnalyzed: [
        {
            name: "Competitor A",
            googleRating: 4.2,
            reviewsAnalyzed: 400,
            positivePercentage: 75,
            negativePercentage: 25,
            avgSentiment: 0.6
        },
        {
            name: "Competitor B",
            googleRating: 4.8,
            reviewsAnalyzed: 600,
            positivePercentage: 90,
            negativePercentage: 10,
            avgSentiment: 0.8
        },
        {
            name: "Competitor C",
            googleRating: 3.9,
            reviewsAnalyzed: 250,
            positivePercentage: 60,
            negativePercentage: 40,
            avgSentiment: 0.3
        }
    ],
    competitorsDetails: [
        {
            address: "123 Main St, Anytown",
            googleMaps: "https://maps.google.com/?q=CompetitorA",
            aiInsights: "Competitor A shows strong performance in customer service, but struggles with product variety. Focus on expanding your product line."
        },
        {
            address: "456 Oak Ave, Anytown",
            googleMaps: "https://maps.google.com/?q=CompetitorB",
            aiInsights: "Competitor B excels in online presence and marketing. Consider enhancing your digital marketing efforts to compete effectively."
        },
        {
            address: "789 Pine Ln, Anytown",
            googleMaps: "https://maps.google.com/?q=CompetitorC",
            aiInsights: "Competitor C has a loyal local customer base but lacks digital engagement. Improve your local SEO and community involvement."
        }
    ],
    competitorSentimentComparisonChart: [
        { name: "Competitor A", negative: 25, positive: 75, neutral: 0 },
        { name: "Competitor B", negative: 10, positive: 90, neutral: 0 },
        { name: "Competitor C", negative: 40, positive: 60, neutral: 0 }
    ],
    competitorRating_averageSentiment_chart: [
        { googleRating: 4.2, averageSentiment: 0.6, competitorName: "Competitor A" },
        { googleRating: 4.8, averageSentiment: 0.8, competitorName: "Competitor B" },
        { googleRating: 3.9, averageSentiment: 0.3, competitorName: "Competitor C" }
    ],
    pieChart: {
        title: "Overall Sentiment Score",
        positive: 75,
        negative: 20,
        neutral: 5
    },
    reviewsAnalyzedPerCompetitor: [
        { name: "Competitor A", reviews: 400 },
        { name: "Competitor B", reviews: 600 },
        { name: "Competitor C", reviews: 250 }
    ]
};
  
const socialSWOTTestData = {
    analysisTitle: "Instagram Analysis for https://www.instagram.com/thetransformix",
    followers: 376,
    following: 1,
    engagementRate: 82,
    profileInfo: {
        basicInfo: {
        name: "Transformix Solutions",
        bio: "We grow brands in the GCC with Data Science - Powered Digital Marketing & Digital Transformation Solutions. Book your strategy session now 🚀",
        verified: false,
        private: false,
        website: "https://thetransformix.com/"
        },
        additionalMetrics: {
        postsCount: 52,
        averageLikes: 2.6,
        averageComments: 0.5,
        EngagementPerPost: 3.1
        }
    },
    topHashTags: [
        { tag: "transformix", frequency: 15 },
        { tag: "branding", frequency: 12 },
        { tag: "datascience", frequency: 8 },
        { tag: "ai", frequency: 6 },
        { tag: "تسويق رقمي", frequency: 5 },
        { tag: "تحول رقمي", frequency: 4 },
        { tag: "إدارة_بيانات", frequency: 3 },
        { tag: "مؤسسات_خاصة", frequency: 3 },
        { tag: "قوة_البيانات", frequency: 2 },
        { tag: "machinelearning", frequency: 2 }
    ],
    fullSocialAnalysis: `
    ## Summary
    Okay, let's analyze Transformix Solutions' Instagram profile and develop a plan to boost their presence and effectiveness.

    ### Profile Optimization Score: 45/100
    *   **Rationale:** While the bio is clear and the profile is active, the low follower count, lack of verification, and a limited focus on engagement opportunities drag down the score. There's significant room for improvement in several areas.

    ### Content Strategy Recommendations:
    #### Diversify Content Formats:
    *   **Currently:** The analysis only provides hashtag data, which suggests the content is likely heavily text or image-based with captions.
    *   **Recommendations:** Introduce a wider variety of content formats to cater to different learning styles and attention spans:
    *   **Reels:** Short, engaging videos showcasing quick tips, case studies, behind-the-scenes looks, or explainer videos on data science/digital transformation concepts. Reels have high organic reach on Instagram. **Example:** Create a reel showing a before-and-after of a client's website traffic after implementing Transformix's SEO strategy.
    *   **Stories:** Use Stories for interactive content like polls, quizzes, Q&A sessions with data scientists, sharing user-generated content (if available), and promoting upcoming webinars or events. **Example:** Run a poll asking followers what their biggest challenge is with digital transformation.
    *   **Carousel Posts:** Break down complex topics into easily digestible steps or showcase multiple aspects of a project. **Example:** A carousel outlining the steps involved in a data-driven marketing campaign.
    *   **Live Sessions:** Host live Q&A sessions with industry experts or Transformix team members to build authority and engage with your audience in real-time.
    #### Content Pillars Based on Audience Needs:
    *   **Currently:** Content seems focused on keywords and services offered.
    *   **Recommendation:** Shift to a more audience-centric approach by addressing their pain points, providing valuable insights, and establishing thought leadership. Develop content pillars around key themes:
    *   **Solving GCC Business Challenges:** Focus on how data science and digital transformation can specifically address challenges faced by businesses in the GCC region (e.g., adapting to cultural nuances, optimizing for local search engines, leveraging mobile-first strategies).
    *   **Data-Driven Success Stories:** Showcase client success stories with quantifiable results. Use visuals (charts, graphs) to demonstrate the impact of Transformix's solutions. **Example:** "How we increased lead generation by 30% for a real estate company in Dubai using targeted Facebook ads!"
    *   **Demystifying Data Science & AI:** Break down complex concepts into simple, understandable terms. Create content that educates your audience about the power and potential of these technologies. **Example:** "AI for Beginners: 3 Ways AI Can Improve Your Marketing ROI."
    *   **Digital Transformation Trends in the GCC:** Provide insights into the latest trends and technologies shaping the digital landscape in the GCC region. **Example:** "The Rise of E-commerce in Saudi Arabia: Key Trends and Opportunities."

    ### Keyword Research & Optimization:
    *   **Currently:** Using basic hashtags.
    *   **Recommendation:** Conduct thorough keyword research to identify relevant and high-performing hashtags. Use a mix of:
    *   **Broad Hashtags:** #digitalmarketing, #datascience, #digitaltransformation
    *   **Niche Hashtags:** #gccmarketing, #dubaimarketing, #saudidigiitaltransformation
    *   **Branded Hashtags:** #transformixsolutions (use consistently)
    *   **Trending Hashtags:** Monitor trending topics in the tech space and incorporate relevant hashtags into your posts (when appropriate).
    *   **Hashtag Strategy:** Use a combination of 5-10 relevant hashtags per post. Monitor hashtag performance and adjust your strategy accordingly.

    ### Content Calendar & Consistency:** Develop a content calendar to ensure a consistent posting schedule (e.g., 3-5 posts per week). Consistency is crucial for maintaining audience engagement and growing your follower base.

    ### Engagement Improvement Suggestions:
    #### Call to Actions (CTAs):
    *   **Currently:** Limited to "book your strategy session."
    *   **Recommendation:** Incorporate diverse CTAs in your posts and stories:
    *   Ask questions to spark conversation. **Example:** "What's your biggest challenge with implementing AI in your business?"
    *   Encourage followers to share their experiences. **Example:** "Share your favorite data science tool in the comments below."
    *   Run polls and quizzes to gather insights and increase engagement.
    *   Promote lead magnets (e.g., free e-books, templates, webinars) in exchange for email addresses.
    #### Respond to Comments & Messages:** Actively respond to comments and direct messages in a timely manner. Show that you value your audience's input and are willing to engage in meaningful conversations.
    #### Run Contests & Giveaways:** Host contests and giveaways to incentivize engagement and attract new followers. **Example:** "Follow us, like this post, and tag two friends for a chance to win a free digital marketing consultation."
    #### Collaborate with Influencers & Industry Partners:** Partner with relevant influencers and industry leaders to reach a wider audience and build credibility. **Example:** Co-host a webinar with a data science expert or feature a guest post from a thought leader in the digital transformation space.
    #### Engage with Other Accounts:** Actively engage with relevant accounts in your niche by liking, commenting, and sharing their content. This increases your visibility and builds relationships within the community.
    `,
    competitiveAnalysis: [
        `Analyze top competitors in your niche by researching their content strategy, engagement tactics, and audience demographics. Identify their strengths and weaknesses to inform your own strategy.`, 
        `Benchmark posting frequency against industry standards and top-performing competitors. Aim for a consistent and optimal posting schedule to maximize reach and engagement.`, 
        `Study successful content formats in your space by analyzing what types of posts (e.g., Reels, Carousels, Stories, Live sessions) generate the most engagement for competitors and industry leaders.`, 
        `Identify trending hashtags in your industry by using social listening tools and analyzing competitor content. Incorporate these hashtags strategically to improve discoverability.`
    ]
};
  
const brandAuditTestData = {
    brandColors: {
        dominanColor: "#24bcd4",
        colors: ["#24bcd4", "#1c4494", "#24a8d8", "#2468b4", "#2444b8", "#284494"]
    },
    executiveSummary: "Transformix exhibits a generally strong brand presence, particularly on its website, with a clean and modern aesthetic. The color palette aligns well with the official branding profile. The social media presence, while showing effort, requires more consistency and a clearer visual strategy to effectively communicate the brand and its services. The website effectively communicates the company's services and showcases client testimonials. The social media presence needs a more cohesive visual strategy to enhance brand recognition and engagement.",
    overallBrandIdentity_firstImpression: {
        strengths: [
            "Clean and modern website design.",
            "Consistent use of primary brand color (#24bcd4) on the website.",
            "Clear presentation of services and client testimonials on the website.",
            "Professional tone and informative content on the website.",
            "Website's logo placement and appearance are consistent with the official branding.",
            "The website uses a clean and modern aesthetic, which reinforces a sense of trust and professionalism.",
            "Social media posts use the Transformix logo as part of the content."
        ],
        roomForImprovement: [
            "Social media lacks a consistent visual theme and grid strategy.",
            "Typography on social media posts can be improved for better readability.",
            "Some social media posts contain text in a non-English language, which may not appeal to a broad audience.",
            "Lack of clear call-to-actions on social media posts.",
            "The social media grid lacks a cohesive visual strategy, making it appear disorganized.",
            "The use of color on social media is inconsistent, and some posts appear too generic.",
            "The quality of some images on social media could be improved to enhance visual appeal."
        ]
    },
    visualBrandingElements: {
        colorPalette: {
            analysis: "The website effectively utilizes the official brand colors, particularly the dominant color (#24bcd4), creating a cohesive and professional look. The social media presence shows some use of the brand colors, but it's inconsistent and could be strengthened.",
            recommendations: [
                "Maintain consistent use of the official brand colors across all platforms.",
                "Develop a color palette guide for social media to ensure visual consistency.",
                "Use color strategically to highlight key information and create visual interest.",
                "Consider using variations of the brand colors to add depth and dimension to the design."
            ]
        },
        typography: {
            analysis: "The website typography is clean and readable, contributing to the overall professional aesthetic. On social media, the typography varies in quality and readability. Some posts use fonts that are difficult to read or don't align with the brand's visual identity.",
            recommendations: [
                "Establish clear typography guidelines for all platforms, including font families, sizes, and weights.",
                "Ensure all text is readable and accessible, considering factors such as font size, contrast, and spacing.",
                "Use typography strategically to create visual hierarchy and emphasize key information.",
                "Avoid using too many different fonts, as this can create a cluttered and unprofessional look."
            ]
        }
    },
    messaging_content_style: {
        content: "The website content is informative and professional, clearly outlining the company's services and value proposition. The social media content varies in quality, with some posts being informative while others are less engaging. The presence of content in a non-English language may limit its reach.",
        recommendations: [
            "Maintain a consistent tone and style across all platforms.",
            "Develop a content calendar with a clear focus on the target audience and key messaging points.",
            "Ensure all social media content is relevant, engaging, and visually appealing.",
            "Consider translating non-English content to reach a broader audience.",
            "Incorporate clear call-to-actions in all social media posts to drive engagement and conversions."
        ]
    },
    highlights_stories: {
        analysis: "The use of icons and descriptive labels on social media is inconsistent. Some posts use icons effectively to convey information, while others lack visual cues or have confusing labels.",
        recommendations: [
            "Develop a consistent set of icons and descriptive labels for social media highlights and stories.",
            "Ensure icons are visually appealing and easy to understand.",
            "Use descriptive labels that accurately reflect the content of the highlights and stories.",
            "Organize highlights and stories logically to make it easy for users to find information."
        ]
    },
    gridStrategy: {
        analysis: "The social media grid lacks a cohesive visual strategy. The layout appears disorganized and inconsistent, making it difficult to understand the brand's overall message and visual identity.",
        recommendations: [
            "Develop a clear grid strategy that aligns with the brand's visual identity and messaging goals.",
            "Consider using a consistent color scheme, typography, and image style to create a cohesive look.",
            "Plan the grid layout in advance to ensure a visually appealing and engaging feed.",
            "Use a mix of content types, such as images, videos, and text posts, to keep the feed interesting and dynamic.",
            "Balance promotional content with informative and engaging content to build trust and credibility."
        ]
    },
    scores: [
        { title: "Visual Consistency", score: 6 },
        { title: "Color Palette Adherence", score: 7 },
        { title: "Typography", score: 6 },
        { title: "Messaging Clarity", score: 8 },
        { title: "Social Media Grid Cohesion", score: 4 },
        { title: "Logo Usage", score: 9 },
        { title: "Website Design", score: 9 }
    ],
    websiteImage: {
        data: "",
        mime_type: ""
    },
    instaImage: {
        data: "",
        mime_type: ""
    },
    logoImage: {
        data: "",
        mime_type: ""
    }
};

export default{
    dashboardTestData,
    websiteSWOTTestData,
    sentimentTestData,
    socialSWOTTestData,
    brandAuditTestData
}