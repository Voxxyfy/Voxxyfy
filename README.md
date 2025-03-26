[![hero.png](https://i.postimg.cc/76c4SzTh/hero.png)](https://postimg.cc/WFMxvh8c)

# Voxxyfy Browser Extension

A powerful browser extension built with React that enhances your browsing experience. Voxxyfy is designed to be lightweight, user-friendly, and customizable.

## Features

- Modern React-based UI
- Drag and drop functionality using `@dnd-kit/core`
- International support with country flag selection
- Custom checkbox components
- Toggle switches for various settings
- Webpack-based build system for optimal performance

## Installation

### For Development

1. Clone the repository:
```bash
git clone https://github.com/Voxxyfy/Voxxyfy.git
cd Voxxyfy
```

2. Install dependencies:
```bash
yarn install
```

3. Start development build with hot reload:
```bash
yarn dev
```

4. Build for production:
```bash
yarn build
```

5. Create distribution zip:
```bash
yarn zip
```

### For Users

1. Download the latest release from the [Releases page](https://github.com/yourusername/voxxyfy-extension/releases)
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `dist` folder from the extracted release

## Project Structure

```
voxxyfy-extension/
├── src/                # Source code
│   ├── components/    # React components
│   ├── screens/       # Screen components
│   ├── styles/        # SCSS styles
│   ├── constants/     # Constants and configurations
│   ├── libs/          # Utility libraries
│   ├── assets/        # Static assets
│   ├── popup.jsx      # Extension popup entry
│   ├── content.jsx    # Content script
│   └── background.jsx # Background script
├── public/            # Public assets
├── dist/             # Built extension
└── webpack.config.js # Webpack configuration
```

## Configuration

The extension can be configured through the `webpack.config.js` file. Main entry points are:

```javascript
entry: {
  popup: "./src/popup.jsx",
  content: "./src/content.jsx",
  background: "./src/background.jsx",
}
```

## Development

- The extension uses React 19 for the UI
- Webpack is configured for both development and production environments
- SCSS is used for styling
- Background scripts handle extension functionality
- Content scripts interact with web pages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Voxxyfy Team** - *Initial work*

## Acknowledgments

- React team for the amazing framework
- All the contributors who have helped with the project
- The open source community for their invaluable tools and libraries

## Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.