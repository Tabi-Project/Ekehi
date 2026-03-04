# Contributing to Ekehi

Thank you for your interest in supporting women entrepreneurs across Africa! [cite_start]As an open-source project, we welcome contributions that align with our mission of transparency and accessibility[cite: 130].

## How to Contribute

### 1. Reporting Bugs

- Check the [GitHub Issues](link-to-issues) to see if the bug has already been reported.
- If not, open a new issue using the "Bug Report" template. Include your browser, device, and steps to reproduce the error.

### 2. Suggesting Features

- [cite_start]We follow a strict MVP roadmap for the first 4 weeks[cite: 204].
- [cite_start]If you have an idea for a "Future Feature" (like funder-managed listings), please open a "Feature Request" issue for discussion[cite: 196].

### 3. Code Contributions

We use a `prod` / `dev` / `feature/` branching strategy.

1. **Fork** the repository.
2. **Clone** your fork locally.
3. **Create a branch** off `dev` (e.g., `git checkout -b feature/your-feature-name`).
4. [cite_start]**Commit your changes** using Conventional Commits (e.g., `feat: add filter for interest rates` [cite: 164]).
5. **Push** to your fork and submit a **Pull Request** to our `dev` branch.

## Development Standards

- [cite_start]**Mobile First:** All UI contributions must be responsive and tested for Android smartphones[cite: 199].
- [cite_start]**Accessibility:** Ensure all interactive elements have a minimum touch target of 44×44px[cite: 200].
- [cite_start]**Clean Data:** If adding seed data, ensure it includes an expiry date and accurate contact links[cite: 196].

## Review Process

[cite_start]All submissions are reviewed by the TEE team. We aim to review PRs within 48 hours. Please ensure your PR description links to any relevant GitHub Issues or ClickUp tasks.

# Contributing to Ekehi

Thank you for your interest in contributing to **Ekehi**.

Ekehi is an open-source platform that helps women entrepreneurs across Africa access funding, training programs, and business resources.

We welcome contributions from developers, designers, data contributors, and documentation writers.

---

# Ways You Can Contribute

You can contribute in several ways:

### Code Contributions

- New features
- Bug fixes
- Performance improvements
- Refactoring

---

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

---

# Development Workflow

## 1. Fork the Repository

Click the **Fork** button on GitHub.

---

## 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/ekehi.git
cd ekehi
```

---

## 3. Add upstream repository

```bash
git remote add upstream https://github.com/Tabi-Project/Ekehi.git
```

---

## 4. Create A Branch

Always branch from `dev`

```bash
git checkout dev
git pull upstream dev
git checkout -b feature/your-feature-name
```

---

## 5. Make Your Changes

Implement your feature or fix. Ensure:

- Code follows project style
- No unnecessary files are committed

---

## 6. Commit Your Changes And Push

Use clear commit messages, like:

```bash
feat: add funding search filter
fix: resolve authentication error
docs: update README

git push origin feature/your-feature-name
```

---

## 7. Open a Pull Request

Open a pull request to `Dev` branch, Your PR should include:

- Clear description of task done
- Screenshots for UI changes
- Linked Github issue

---

# Issue Tracking

All Tasks are managed through Github Issues. Before creating a new feature:

1. Check if an issue already exists
2. If not, create one describing the feature or bug
3. Link your Pull Request to the issue

# Code Guidelines

- Write clean, readable code
- Keep functions small and modular
- Add comments when necessary
- Avoid unnecessary dependencies

# Reporting Bugs

If you find a bug:
Open a GitHub Issue, include:

- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots if applicable

# Community Guidelines

Please be respectful and constructive. We aim to maintain an inclusive and welcoming open-source community.
