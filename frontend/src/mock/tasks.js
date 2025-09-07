export const tasks = [
  {
    id: "marketing-newsletter-2025-01",
    title: "January 2025 Marketing Newsletter",
    description: "Monthly newsletter highlighting Q4 achievements and Q1 roadmap",
    priority: "high",
    status: "under_review",
    createdBy: "u_marketing",
    reviewerId: "u_reviewer1",
    createdAt: "2025-01-15T10:00:00Z",
    dueDate: "2025-01-25T17:00:00Z",
    score: 85,
    requirements: [
      "Executive summary",
      "Budget justification", 
      "Performance metrics",
      "Legal compliance review"
    ],
    attachments: [
      {
        id: "att_1",
        name: "newsletter_draft_v2.pdf",
        size: 2048000,
        type: "application/pdf",
        uploadedAt: "2025-01-18T14:30:00Z"
      }
    ],
    draftContent: "# January Newsletter Draft\n\nThis is the content of our monthly newsletter...",
    dosAndDonts: {
      dos: [
        "Include specific performance metrics",
        "Maintain consistent brand voice",
        "Cite all external sources"
      ],
      donts: [
        "Use vague language without data backing",
        "Include unverified claims",
        "Exceed 4 pages in length"
      ]
    }
  },
  {
    id: "marketing-campaign-2025-q1",
    title: "Q1 2025 Social Media Campaign",
    description: "Social media strategy and content calendar for Q1",
    priority: "medium", 
    status: "draft",
    createdBy: "u_marketing",
    reviewerId: null,
    createdAt: "2025-01-20T09:00:00Z",
    dueDate: "2025-02-01T17:00:00Z",
    score: 0,
    requirements: [
      "Campaign objectives",
      "Target audience analysis",
      "Budget allocation",
      "Success metrics"
    ],
    attachments: [],
    draftContent: "",
    dosAndDonts: {
      dos: [
        "Define clear KPIs for each platform",
        "Include audience demographic data",
        "Plan for A/B testing scenarios"
      ],
      donts: [
        "Assume audience preferences without research",
        "Ignore platform-specific best practices",
        "Set unrealistic engagement targets"
      ]
    }
  },
  {
    id: "marketing-brand-guide-2025",
    title: "Updated Brand Guidelines 2025",
    description: "Refreshed brand guidelines including new logo variations",
    priority: "low",
    status: "approved",
    createdBy: "u_marketing",
    reviewerId: "u_reviewer1", 
    createdAt: "2025-01-10T11:00:00Z",
    dueDate: "2025-01-30T17:00:00Z",
    score: 100,
    requirements: [
      "Logo specifications",
      "Color palette",
      "Typography guidelines",
      "Usage examples"
    ],
    attachments: [
      {
        id: "att_2",
        name: "brand_guidelines_2025.pdf",
        size: 5242880,
        type: "application/pdf",
        uploadedAt: "2025-01-12T16:20:00Z"
      }
    ],
    draftContent: "# Brand Guidelines 2025\n\n## Logo Specifications\n...",
    dosAndDonts: {
      dos: [
        "Provide clear usage examples",
        "Include minimum size requirements",
        "Show incorrect usage examples"
      ],
      donts: [
        "Allow logo modifications",
        "Use outdated color codes",
        "Forget accessibility considerations"
      ]
    }
  }
];