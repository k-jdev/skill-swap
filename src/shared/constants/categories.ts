export type SkillCategory = {
  value: string;
  label: string;
  group: string;
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  { value: "programming", label: "Programming", group: "Technology" },
  { value: "web-development", label: "Web Development", group: "Technology" },
  {
    value: "mobile-development",
    label: "Mobile Development",
    group: "Technology",
  },
  { value: "data-science", label: "Data Science & AI", group: "Technology" },
  { value: "cybersecurity", label: "Cybersecurity", group: "Technology" },
  { value: "devops-cloud", label: "DevOps & Cloud", group: "Technology" },
  { value: "game-development", label: "Game Development", group: "Technology" },
  { value: "databases", label: "Databases", group: "Technology" },
  { value: "ui-ux", label: "UI/UX Design", group: "Technology" },
  { value: "blockchain", label: "Blockchain & Web3", group: "Technology" },

  { value: "math", label: "Mathematics", group: "Science & Math" },
  { value: "physics", label: "Physics", group: "Science & Math" },
  { value: "chemistry", label: "Chemistry", group: "Science & Math" },
  { value: "biology", label: "Biology", group: "Science & Math" },
  { value: "statistics", label: "Statistics", group: "Science & Math" },

  { value: "language", label: "Foreign Languages", group: "Languages" },
  { value: "linguistics", label: "Linguistics", group: "Languages" },
  { value: "sign-language", label: "Sign Language", group: "Languages" },

  { value: "music", label: "Music & Instruments", group: "Creative Arts" },
  { value: "drawing", label: "Drawing & Illustration", group: "Creative Arts" },
  { value: "painting", label: "Painting", group: "Creative Arts" },
  { value: "photography", label: "Photography", group: "Creative Arts" },
  {
    value: "videography",
    label: "Videography & Editing",
    group: "Creative Arts",
  },
  { value: "graphic-design", label: "Graphic Design", group: "Creative Arts" },
  {
    value: "animation",
    label: "Animation & Motion Graphics",
    group: "Creative Arts",
  },
  { value: "3d-modeling", label: "3D Modeling", group: "Creative Arts" },
  {
    value: "architecture-design",
    label: "Architecture & Interior Design",
    group: "Creative Arts",
  },

  {
    value: "writing",
    label: "Writing & Copywriting",
    group: "Writing & Content",
  },
  {
    value: "blogging",
    label: "Blogging & Content Creation",
    group: "Writing & Content",
  },
  {
    value: "screenwriting",
    label: "Screenwriting",
    group: "Writing & Content",
  },
  { value: "translation", label: "Translation", group: "Writing & Content" },

  {
    value: "business",
    label: "Business & Entrepreneurship",
    group: "Business & Finance",
  },
  {
    value: "finance",
    label: "Finance & Accounting",
    group: "Business & Finance",
  },
  { value: "marketing", label: "Marketing & SEO", group: "Business & Finance" },
  {
    value: "project-management",
    label: "Project Management",
    group: "Business & Finance",
  },
  { value: "sales", label: "Sales & Negotiation", group: "Business & Finance" },
  {
    value: "investing",
    label: "Investing & Trading",
    group: "Business & Finance",
  },
  { value: "legal", label: "Legal & Law", group: "Business & Finance" },

  {
    value: "sports-fitness",
    label: "Sports & Fitness",
    group: "Health & Lifestyle",
  },
  {
    value: "yoga-meditation",
    label: "Yoga & Meditation",
    group: "Health & Lifestyle",
  },
  {
    value: "nutrition",
    label: "Nutrition & Dietetics",
    group: "Health & Lifestyle",
  },
  {
    value: "cooking",
    label: "Cooking & Culinary Arts",
    group: "Health & Lifestyle",
  },
  { value: "baking", label: "Baking & Pastry", group: "Health & Lifestyle" },
  {
    value: "psychology",
    label: "Psychology & Coaching",
    group: "Health & Lifestyle",
  },

  {
    value: "mechanical-engineering",
    label: "Mechanical Engineering",
    group: "Engineering",
  },
  {
    value: "electrical-engineering",
    label: "Electrical Engineering",
    group: "Engineering",
  },
  {
    value: "civil-engineering",
    label: "Civil Engineering",
    group: "Engineering",
  },
  { value: "robotics", label: "Robotics & Electronics", group: "Engineering" },

  { value: "crafts-diy", label: "Crafts & DIY", group: "Crafts & Hobbies" },
  {
    value: "fashion-sewing",
    label: "Fashion & Sewing",
    group: "Crafts & Hobbies",
  },
  { value: "woodworking", label: "Woodworking", group: "Crafts & Hobbies" },
  { value: "gardening", label: "Gardening", group: "Crafts & Hobbies" },
  {
    value: "chess",
    label: "Chess & Strategy Games",
    group: "Crafts & Hobbies",
  },

  {
    value: "personal-development",
    label: "Personal Development",
    group: "Personal Development",
  },
  {
    value: "public-speaking",
    label: "Public Speaking",
    group: "Personal Development",
  },
  {
    value: "time-management",
    label: "Time Management",
    group: "Personal Development",
  },
  { value: "leadership", label: "Leadership", group: "Personal Development" },
];

export const SKILL_CATEGORY_GROUPS = [
  ...new Set(SKILL_CATEGORIES.map((c) => c.group)),
];
