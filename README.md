# 📊 Chart Generator

A modern, responsive chart generation application built with Next.js 15, TypeScript, and Tailwind CSS. Create beautiful, interactive charts with ease using a clean and intuitive interface.

## ✨ Features

- **Interactive Chart Creation**: Generate various types of charts with customizable data
- **Modern UI/UX**: Built with Tailwind CSS and tailwindcss-animate for smooth animations
- **TypeScript Support**: Full type safety and enhanced developer experience
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Environment Configuration**: Customizable port and environment settings
- **Fast Development**: Hot reload and optimized build process with Next.js 15
- **React 19 Ready**: Built with the latest React release candidate

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.0.3](https://nextjs.org/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Frontend**: [React 19.0.0-rc](https://react.dev/)
- **Styling**: [Tailwind CSS 3.4.1](https://tailwindcss.com/)
- **Animations**: [tailwindcss-animate 1.0.7](https://github.com/jamiebuilds/tailwindcss-animate)
- **Build Tools**: PostCSS, Autoprefixer
- **Code Quality**: ESLint with Next.js configuration

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

You can verify your installations by running:
```bash
node --version
npm --version
git --version
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/christybreslin/chart-generator.git
cd chart-generator
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js and React
- TypeScript definitions
- Tailwind CSS and PostCSS
- ESLint configuration
- All other project dependencies

### 3. Environment Configuration

The project includes a `.env` file for environment configuration. The default configuration includes:

```env
PORT=3000
```

**To customize the port:**
1. Open the `.env` file in the root directory
2. Change the `PORT` value to your desired port number:
   ```env
   PORT=8080  # or any other available port
   ```
3. Save the file

**Note**: The `.env` file is included in the repository, so it will be available immediately after cloning.

## 🏃‍♂️ Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at:
- Default: `http://localhost:3000`
- Custom port: `http://localhost:[YOUR_PORT]` (if you modified the .env file)

### Production Build

To create an optimized production build:

```bash
npm run build
npm start
```

### Linting

To check code quality and fix issues:

```bash
npm run lint
```

## 💻 Usage

1. **Start the Application**: Run `npm run dev` to start the development server
2. **Open in Browser**: Navigate to `http://localhost:3000` (or your custom port)
3. **Create Charts**: Use the intuitive interface to input your data and generate charts
4. **Customize**: Modify chart types, colors, and styling options
5. **Export**: Save or export your generated charts

## 📁 Project Structure

```
chart-generator/
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/            # Reusable React components
│   └── chart-generator.tsx # Main chart generator component
├── public/               # Static assets
├── .env                  # Environment configuration
├── .gitignore           # Git ignore rules
├── next.config.mjs      # Next.js configuration
├── package.json         # Project dependencies and scripts
├── postcss.config.mjs   # PostCSS configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project documentation
```

## 🔧 Configuration Files

### Next.js Configuration (`next.config.mjs`)
- Disabled ESLint and TypeScript build errors for faster development
- Enabled unoptimized images for better performance in development

### Tailwind Configuration (`tailwind.config.ts`)
- Custom theme extensions and color schemes
- Animation configurations
- Responsive breakpoints

### TypeScript Configuration (`tsconfig.json`)
- Strict type checking enabled
- Path mapping for cleaner imports
- Optimized for Next.js development

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
- Next.js will automatically try the next available port (3001, 3002, etc.)
- Or manually set a different port in your `.env` file

**Missing Dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**
- Ensure you're using Node.js 18+ and npm 8+
- Check that all dependencies are properly installed
- Run `npm run lint` to check for code issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [https://github.com/christybreslin/chart-generator](https://github.com/christybreslin/chart-generator)
- **Issues**: [Report a bug or request a feature](https://github.com/christybreslin/chart-generator/issues)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS Documentation**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/christybreslin/chart-generator/issues) page
2. Create a new issue with detailed information about your problem
3. Include your Node.js version, npm version, and operating system

---

**Happy Chart Creating! 📊✨** 