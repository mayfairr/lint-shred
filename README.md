# 🚀 Lint Shred

**Lint Shred** is a powerful command-line tool designed to help projects that have struggled with ESLint compliance. If your JavaScript and TypeScript codebase is facing a pileup of linting issues due to inconsistent or improper ESLint usage, **Lint Shred** is here to save the day! This tool enables you to effectively manage ESLint rules and lint your staged files, ensuring that your code remains clean and maintainable while tackling existing issues.

---

## ✨ Features

- **Automated ESLint Checks**: Automatically run ESLint on your staged files.
- **Customizable Output**: Save linting results to a specified file in JSON format.
- **Simple Integration**: Easy to integrate into your existing development workflow.
- **Error Handling**: Graceful error handling with detailed feedback.

---

## 📦 Installation

```bash
# With Yarn
yarn add lint-shred

# With NPM
npm install lint-shred
```
---

## 🛠️ Usage
First you need to take a snapshot of all current eslint errors within the project. Start by running this in the root directory: 
```bash
# Generate /eslintbaseline.json
yarn lint-shred generate
```

> This will take some time depending on the project O(N). Be Patient. You only need to run this once

After this has completed you will see a file called `eslintbaseline.json` In this same DIR, run the following command:
```bash 
# Compare with staged files
yarn lint-shred compare
```
This will compare the current `staged` only files. Any changes introduce will cause this to exit with code 1.

## 🤝 Contributing
We welcome contributions! If you have suggestions for improvements, feel free to fork the repository and submit a pull request.

Steps to Contribute

1. Fork the Repository: Click on the "Fork" button at the top-right corner of this page.
2. Create Your Feature Branch
```bash
git checkout -b feature/YourFeature
```
3. Commit Your Changes
```bash
git commit -m "Add some feature"
```
4. Push to the Branch
```bash
git push origin feature/YourFeature
```
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See LICENSE for more information.

## 💬 Contact
For inquiries, please contact mayfairr on discord `mayfairr`.

## 🌐 Links
[GitHub Repository](https://github.com/mayfairr/lint-shred)
<br/>
[NPM](https://www.npmjs.com/package/lint-shred)
