# Sentinel Audit Platform

AI Powered Financial Crime Detection System

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React

## Features

- Dashboard with AI-powered insights
- Real-time alerts management
- Investigation tracking
- Report generation
- Data upload capabilities
- User management
- Settings configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Deployment

This project is optimized for Vercel deployment.

### Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Click Deploy

### Environment Variables

Add any required environment variables in your Vercel project settings:

```
# Add your environment variables here
```

## Project Structure

```
├── app/              # Next.js app directory
│   ├── dashboard/    # Dashboard page
│   ├── alerts/       # Alerts management
│   ├── investigations/ # Investigation tracking
│   ├── reports/      # Reports
│   ├── upload/       # Data upload
│   ├── settings/     # Settings
│   └── users/        # User management
├── components/       # React components
│   ├── dashboard/    # Dashboard components
│   ├── layout/       # Layout components
│   └── ui/           # UI components
├── lib/              # Utility functions
├── data/             # Mock data
└── types/            # TypeScript types
```

## License

Private
