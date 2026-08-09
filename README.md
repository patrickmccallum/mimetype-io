# mimetype.io

Hello! mimetype.io is an open-source Next.js project that provides a comprehensive database and resources related to various MIME types. We welcome contributors of all levels to join us and make this platform even better.

The site is statically generated: every page is built ahead of time from
[`src/mimeData.json`](src/mimeData.json), which is the file most contributions
touch.

## Quick Start

### Prerequisites

- Node.js (v24 — see `.nvmrc`)

### Installation

1. Fork and clone the repository.

```bash
git clone https://github.com/patrickmccallum/mimetype-io.git
```

2. Navigate into the project directory.

```bash
cd mimetype-io
```

3. Install the dependencies.

```bash
npm install
```

4. Start the dev server.

```bash
npm run dev
```

### Checks

`npm test` runs everything CI runs: formatting, TypeScript, data validation,
a production build, and assertions against the exported pages.

```bash
npm test
```

If you only changed `src/mimeData.json`, `npm run test:data` is the quick check
— it catches malformed entries, duplicate names, and cross-links that would make
one mimetype's page overwrite another's.

## Contributing

Contributions are welcome and greatly appreciated!

1. Fork the project.
2. Create a new branch for your feature (`git checkout -b feature/newFeature`).
3. Commit your changes (`git commit -m 'Add newFeature'`).
4. Push to your feature branch (`git push origin feature/newFeature`).
5. Open a Pull Request.

## Contact

For any queries, feel free to reach out either here, with an issue, or at contact [at] mimetype [dot] io
