<img width="1906" height="853" alt="image" src="https://github.com/user-attachments/assets/37346896-a9d4-4b82-9ae6-84163d839968" />
# SkillSwap

A modern platform for skill exchange and learning. Connect with others, share your expertise, and discover new skills in a collaborative community.

## Features

- 🔐 **User Authentication** - Secure login and registration with email validation
- 🔍 **Skill Discovery** - Browse and search for skills across multiple categories
- 🏷️ **Skill Filtering** - Filter skills by categories (Design, Development, Marketing, Business)
- 👤 **User Profiles** - Create and manage your profile with your skills
- 💼 **Skill Exchange** - Connect with other users to exchange knowledge and expertise
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework**: [Next.js 15](https://nextjs.org) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Form Validation**: [Zod](https://zod.dev)
- **UI Components**: Custom reusable components (Button, Input, NavBar)
- **Font**: [Geist Font Family](https://vercel.com/font)
- **Linting**: ESLint with Next.js configuration

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication routes (login, register)
│   ├── (public)/          # Public routes (browse, learn)
│   └── layout.tsx         # Root layout
├── components/
│   └── ui/                # Reusable UI components (Button, Input, NavBar)
├── features/
│   ├── auth/              # Authentication feature
│   │   ├── components/    # LoginForm, RegisterForm, HeaderBlock
│   │   └── schemas/       # Zod validation schemas
│   └── browse/            # Browse skills feature
│       └── components/    # Search, SkillFilter, Card, Header
└── shared/
    └── lib/               # Shared utilities and helpers
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd skill-swap
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Create a production build:

```bash
npm run build
npm run start
```

### Linting

Check code quality:

```bash
npm run lint
```

## Pages

- `/` - Home page
- `/login` - User login page
- `/register` - User registration page
- `/browse` - Browse and discover skills
- `/learn` - Learning resources page

## Components

### UI Components
- **Button** - Reusable button component with hover effects
- **Input** - Form input with error handling and validation display
- **NavBar** - Navigation bar with logo and action buttons

### Feature Components
- **LoginForm** - User login with email and password validation
- **RegisterForm** - User registration with form fields
- **Search** - Skill search component with search icon
- **SkillFilter** - Category filter buttons for skills
- **Card** - Skill card displaying skill information
- **Header** - Section headers and titles

## Customization

### Colors

The project uses a custom color palette defined in `tailwind.config.js`. The primary color is blue (`#137fec`). You can modify the theme by editing the Tailwind configuration.

### Fonts

The project uses Geist and Geist Mono fonts from Google Fonts. To change fonts, modify the font imports in [src/app/layout.tsx](src/app/layout.tsx).

## Form Validation

The project uses Zod for schema validation. Validation schemas are located in `src/features/auth/schemas/`. Currently implemented:
- Login schema - Email and password validation

**TODO**: Implement and document form validation for the registration form.

## Future Enhancements

- [ ] Backend API integration
- [ ] User profile pages
- [ ] Messaging/chat system
- [ ] Skill ratings and reviews
- [ ] Payment integration for premium features
- [ ] Dark mode support enhancement
- [ ] Advanced search and filtering

## Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Your app will be deployed and accessible via a Vercel URL

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)
- [React Hooks Documentation](https://react.dev/reference/react/hooks)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please open an issue in the repository or contact the development team.
