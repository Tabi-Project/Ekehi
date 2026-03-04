
# Contributing to Ekehi

Thank you for your interest in contributing to **Ekehi**.

Ekehi is an open-source platform that helps women entrepreneurs across Africa access funding, training programs, and business resources.

We welcome contributions from developers, designers, data contributors, and documentation writers.

# Ways You Can Contribute

You can contribute in several ways:

### Code Contributions

- New features
- Bug fixes
- Performance improvements
- Refactoring


# Project Branching Strategy

The repository uses the following branches:
main (production / stable)
│
dev (integration branch)
│
├── feature/<feature-name>
├── fix/<bug-name>
├── docs/<docs-change>
└── chore/<maintenance>

### Important Rules

- Do **not commit directly to `main`**
- All work must go through **Pull Requests**
- Feature branches must be created from `dev`


# Development Workflow

### 1. Fork the Repository

Click the **Fork** button on GitHub.


### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/ekehi.git
cd ekehi
```

### 3. Add upstream repository

```bash
git remote add upstream https://github.com/Tabi-Project/Ekehi.git
```

### 4. Create A Branch

Always branch from `dev`

```bash
git checkout dev
git pull upstream dev
git checkout -b feature/your-feature-name
```

### 5. Make Your Changes

Implement your feature or fix. Ensure:

- Code follows project style
- No unnecessary files are committed

### 6. Commit Your Changes And Push

Use clear commit messages, like:

```bash
feat: add funding search filter
fix: resolve authentication error
docs: update README

git push origin feature/your-feature-name
```

### 7. Open a Pull Request

Open a pull request to `Dev` branch, Your PR should include:

- Clear description of task done
- Screenshots for UI changes
- Linked Github issue

---

## Issue Tracking

All Tasks are managed through Github Issues. Before creating a new feature:

1. Check if an issue already exists
2. If not, create one describing the feature or bug
3. Link your Pull Request to the issue

## Code Guidelines

- Write clean, readable code
- Keep functions small and modular
- Add comments when necessary
- Avoid unnecessary dependencies

## Reporting Bugs

If you find a bug:
Open a GitHub Issue, include:

- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots if applicable

## Community Guidelines

Please be respectful and constructive. We aim to maintain an inclusive and welcoming open-source community.
