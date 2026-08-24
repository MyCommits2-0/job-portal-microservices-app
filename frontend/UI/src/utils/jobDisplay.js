const palette = [
  { bg: "bg-blue-600", text: "text-white" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-green-500", text: "text-white" },
  { bg: "bg-red-500", text: "text-white" },
  { bg: "bg-sky-500", text: "text-white" },
  { bg: "bg-gray-900", text: "text-white" },
  { bg: "bg-pink-500", text: "text-white" },
  { bg: "bg-gray-100", text: "text-blue-600" },
];

export function getCompanyInitials(company = "") {
  const words = company.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/);
  if (words.length === 0 || !words[0]) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function getCompanyLogoStyle(id = 0) {
  return palette[Math.abs(id) % palette.length];
}

export function formatJobType(type = "") {
  return type
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

const responsibilityBank = [
  "Collaborate with cross-functional teams to deliver high-quality work on schedule.",
  "Own tasks end-to-end, from planning through execution and follow-up.",
  "Communicate progress, blockers, and risks clearly to stakeholders.",
  "Continuously look for ways to improve processes and outcomes.",
  "Participate in regular reviews and contribute constructive feedback.",
];

const requirementBank = [
  "Strong communication and problem-solving skills.",
  "Ability to work independently and manage priorities in a fast-paced environment.",
  "A collaborative mindset and willingness to learn.",
];

const benefitBank = [
  "Competitive salary and performance bonuses",
  "Flexible working hours",
  "Health insurance coverage",
  "Learning & development budget",
  "Paid time off",
];

const categoryContent = {
  Development: {
    responsibilities: [
      "Design, build, and maintain efficient, reusable, and reliable code.",
      "Debug and resolve technical issues across the stack.",
      "Write and maintain unit/integration tests to ensure code quality.",
    ],
    requirements: [
      "Solid understanding of data structures, algorithms, and software design.",
      "Experience with version control systems such as Git.",
      "Familiarity with the relevant languages/frameworks for this role.",
    ],
  },
  Design: {
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs.",
      "Conduct user research and translate insights into design decisions.",
      "Maintain consistency across the design system and brand guidelines.",
    ],
    requirements: [
      "Proficiency with design tools such as Figma or Adobe XD.",
      "A strong portfolio demonstrating UI/UX design work.",
      "Understanding of usability and accessibility best practices.",
    ],
  },
  Marketing: {
    responsibilities: [
      "Plan and execute marketing campaigns across multiple channels.",
      "Analyze campaign performance and report on key metrics.",
      "Coordinate with content, design, and sales teams on go-to-market plans.",
    ],
    requirements: [
      "Experience with digital marketing tools and analytics platforms.",
      "Strong written and verbal communication skills.",
      "Creative thinking with a data-driven approach.",
    ],
  },
  Management: {
    responsibilities: [
      "Plan project timelines, scope, and resource allocation.",
      "Coordinate across teams to keep initiatives on track.",
      "Report progress and risks to leadership regularly.",
    ],
    requirements: [
      "Proven experience leading cross-functional projects or teams.",
      "Excellent organizational and stakeholder-management skills.",
      "Comfort working with ambiguity and shifting priorities.",
    ],
  },
  Product: {
    responsibilities: [
      "Define product requirements and prioritize the roadmap.",
      "Work closely with design and engineering to ship features.",
      "Gather and analyze user feedback to guide product decisions.",
    ],
    requirements: [
      "Experience owning a product area or feature set.",
      "Strong analytical and prioritization skills.",
      "Ability to communicate a clear product vision.",
    ],
  },
  Networking: {
    responsibilities: [
      "Configure, maintain, and troubleshoot network infrastructure.",
      "Monitor network performance and address issues proactively.",
      "Document network architecture and standard operating procedures.",
    ],
    requirements: [
      "Understanding of networking protocols and infrastructure (TCP/IP, DNS, VPN).",
      "Experience with network monitoring and diagnostic tools.",
      "Relevant certifications are a plus (CCNA or similar).",
    ],
  },
  Testing: {
    responsibilities: [
      "Design and execute test plans and test cases.",
      "Identify, document, and track defects through resolution.",
      "Collaborate with developers to improve overall product quality.",
    ],
    requirements: [
      "Experience with manual and/or automated testing tools.",
      "Strong attention to detail.",
      "Understanding of the software development lifecycle.",
    ],
  },
};

export function getCategoryCounts(jobsList) {
  const counts = {};

  jobsList.forEach((job) => {
    if (!job.category) return;
    counts[job.category] = (counts[job.category] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getCompanyCounts(jobsList) {
  const counts = {};

  jobsList.forEach((job) => {
    if (!job.company) return;
    counts[job.company] = (counts[job.company] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count);
}

export function getJobDescriptionContent(job) {
  const category = categoryContent[job.category] || {};

  return {
    summary: `${job.company} is looking for a motivated ${job.title} to join their ${job.location} team on a ${formatJobType(
      job.type
    )} basis. This is a great opportunity to grow your career in ${job.category?.toLowerCase() || "this field"} while working with a collaborative, fast-moving team.`,
    responsibilities: category.responsibilities || responsibilityBank,
    requirements: [...(category.requirements || []), ...requirementBank].slice(0, 4),
    benefits: benefitBank,
  };
}
