import AdmZip from 'adm-zip';
import { config } from 'dotenv';
import fs from 'fs-extra';
import { sync as syncGlob } from 'glob';
import MarkdownIt from 'markdown-it';
import moment from 'moment';
import path from 'path';

config();

const zip = new AdmZip();

const patterns = [
	'admin/**',
	'build/**',
	'includes/**',
	'languages/**',
	'public/**',
	`plugin.php`,
	'uninstall.php'
];

// Define the destination directory
const destination = `deploy`;
// Ensure the destination directory exists
fs.ensureDirSync(destination);
// Function to copy matched files to the destination
patterns.forEach((pattern) => {
	const files = syncGlob(pattern, { nocase: true, nodir: true });
	files.forEach((file) => {
		const destPath = path.join(destination, file);
		fs.ensureDirSync(path.dirname(destPath)); // Ensure the destination directory exists
		fs.copySync(file, destPath);
	});
});
zip.addLocalFolder('./deploy', process.env.SLUG);
fs.ensureDirSync('./dist');
zip.writeZip(`./dist/${process.env.SLUG}.zip`);
(async () => {
	const markdown = MarkdownIt({
		html: true
	});
	const data = {
		name: process.env.NAME,
		slug: process.env.SLUG,
		version: process.env.VERSION.replace(
			'{TS}',
			process.env?.GITHUB_RUN_NUMBER ?? Date.now().toString().slice(0, -3)
		),
		author: process.env.AUTHOR_NAME,
		author_profile: process.env.AUTHOR_URL,
		requires: process.env.MIN_WP,
		tested: process.env.TESTED_WP,
		requires_php: process.env.MIN_PHP,
		compatibility: [],
		last_updated: moment().utc().format(),
		added: moment().utc().format(),
		homepage: process.env.URI,
		sections: {
			description: process.env.DESCRIPTION,
			installation: markdown.render(
				fs.readFileSync('./INSTALL.md', 'utf8')
			),
			changelog: markdown.render(
				fs.readFileSync('./CHANGELOG.md', 'utf8')
			)
		},
		banners: {
			low: process.env.BANNER_URL_LOW,
			high: process.env.BANNER_URL_HIGH
		},
		icon: process.env.ICON_URL,
		screenshots: {}
	};

	fs.writeFileSync('./dist/info.json', JSON.stringify(data));

	// Generate stable branch README
	const readme = `# ${process.env.NAME}

${process.env.DESCRIPTION}

[![GitHub license](https://img.shields.io/github/license/GrootMade/connect)](https://github.com/GrootMade/connect/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/GrootMade/connect)](https://github.com/GrootMade/connect/stargazers)

> **This is the stable release branch.** It is auto-built from the [\`main\`](https://github.com/GrootMade/connect/tree/main) branch via GitHub Actions.
> For source code and development instructions, see the [main branch](https://github.com/GrootMade/connect/tree/main).

## Installation

1. Download [\`${process.env.SLUG}.zip\`](https://raw.githubusercontent.com/GrootMade/connect/stable/${process.env.SLUG}.zip).
2. In your dashboard, go to **Plugins → Add New → Upload Plugin**.
3. Select the downloaded ZIP and click **Install Now**.
4. Click **Activate Plugin**.
5. Navigate to the **${process.env.NAME}** menu in your admin sidebar to get started.

## Requirements

| Requirement | Minimum |
|-------------|---------|
| PHP         | ${process.env.MIN_PHP}+    |
| WP          | ${process.env.MIN_WP}+    |

## Current Version

**${data.version}** — built ${data.last_updated}

## Links

- 🌐 [Website](${process.env.URI})
- 📦 [Source Code](https://github.com/GrootMade/connect/tree/main)
- 🐛 [Report an Issue](https://github.com/GrootMade/connect/issues)
- 📖 [Changelog](https://github.com/GrootMade/connect/blob/main/CHANGELOG.md)

## License

This project is licensed under the GNU General Public License v3.0 — see the [LICENSE](https://github.com/GrootMade/connect/blob/main/LICENSE) file for details.
`;
	fs.writeFileSync('./dist/README.md', readme);
})();
console.log('All files have been copied successfully.');
