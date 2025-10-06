# Yezz.me

A modern, interactive portfolio website built with Next.js, Frame Motion, and ShadCN UI. Features dynamic content management through YAML and MDX files.

## Features

- 🎨 **Modern Design**: Beautiful, responsive design with dark/light mode support
- 📝 **Dynamic Content**: Blog posts, projects, and talks managed through YAML/MDX
- 📱 **Responsive**: Works perfectly on all devices
- ⚡ **Performance**: Built with Next.js 15 and optimized for speed
- 🔍 **SEO Optimized**: Proper metadata and Open Graph tags
- 🎯 **Accessibility**: WCAG compliant components

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + ShadCN UI
- **Content**: MDX + YAML
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

- Clone the repository:

```bash
git clone https://github.com/yezz123/portfolio
cd portfolio
```

- Install dependencies:

```bash
pnpm install
```

- Start the development server:

```bash
pnpm run dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Personal Information

Edit `data/personal-info.yaml` to update your personal details:

```yaml
name: "Your Name"
title: "Your Title"
bio: "Your short bio"
bioLong: |
  Your longer bio here...
avatar: "/images/avatar.jpg"
location: "Your Location"
email: "your-email@example.com"
github: "yourusername"
twitter: "yourusername"
linkedin: "yourusername"
```

### Projects

Add your projects in `data/projects.yaml`:

```yaml
- id: "project-id"
  name: "Project Name"
  description: "Project description"
  url: "https://project-url.com"
  githubUrl: "https://github.com/username/repo"
  imageUrl: "/images/projects/project.jpg"
  technologies: ["React", "Next.js", "TypeScript"]
  featured: true
  pinned: true
```

### Blog Posts

Create new blog posts in `src/content/blog/` as `.mdx` files:

```mdx
---
title: "Your Blog Post Title"
date: "2024-01-15"
excerpt: "Short description of your post"
tags: ["React", "Next.js", "Tutorial"]
featured: true
---

# Your Blog Post

Your content here...
```

### Talks

Add new talks in `content/talks/` as `.mdx` files:

```mdx
---
title: "Your Talk Title"
date: "2024-01-15"
venue: "Conference Name"
description: "Talk description"
slidesUrl: "https://slides.com/your-slides"
videoUrl: "https://youtube.com/watch?v=example"
imageUrl: "/images/talks/talk.jpg"
tags: ["React", "JavaScript"]
---

Your content here...
```

### Uses

Configure your setup and tools in `data/uses.yaml`:

```yaml
- category: "desk"
  name: "MacBook Pro"
  description: "My main development machine"
  icon: "💻"

- category: "tools"
  name: "VS Code"
  description: "My code editor"
  url: "https://code.visualstudio.com"
  icon: "📝"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this template for your own portfolio!

## Support

If you have questions or need help customizing the portfolio:

- Create an issue on GitHub
- Review the example content files

---

Built with ❤️ using Next.js, Tailwind CSS, and modern web technologies.
