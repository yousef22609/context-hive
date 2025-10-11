# Minimal Template

The essential Context Hive template for getting started. This template provides the 4 core documents needed to collaborate with AI from Day 0.

## What's Included

This template contains blank/example versions of the four pillars:
1. **vision.md** - Define the why and what
2. **requirements.md** - Specify functional and non-functional requirements
3. **design.md** - Define technical architecture
4. **rules.md** - Establish coding standards

## When to Use This Template

Use the minimal template when:
- Starting a new greenfield project
- Building a small to medium scope application (< 50 files)
- Working solo or with a small team (1-5 people)
- You want the simplest possible Context Hive setup

## How to Use

### Quick Start

1. **Copy the templates**
   ```bash
   mkdir my-project
   cd my-project
   mkdir docs
   # Copy all templates from template/minimal/docs/ to your docs/
   ```

2. **Fill in each template**
   - Start with vision.md (the why)
   - Then requirements.md (the what)
   - Then design.md (the how)
   - Finally rules.md (the standards)

3. **Share with AI**
   ```
   I'm starting a new project using Context Hive methodology.
   I've created four foundational documents. Please read them:

   [Paste or upload your completed docs]

   Do you understand the project?
   ```

4. **Start implementing**
   ```
   Please implement [feature] according to the documentation.
   ```

### Filling Out the Templates

#### Vision Document (~30 minutes)
Ask yourself:
- What problem am I solving?
- Who will use this?
- What's the core value?
- How do I define success?
- What's explicitly NOT included?

Work with AI to refine:
```
I'm building [description]. Help me refine the vision document.
Here's my draft: [paste vision]
```

#### Requirements Document (~30 minutes)
Ask yourself:
- What features must exist?
- What are the constraints?
- What's the priority order?
- What performance is needed?
- What security is required?

Work with AI to complete:
```
Based on the vision, what requirements should I consider?
Here's my draft: [paste requirements]
```

#### Design Document (~45 minutes)
Ask yourself:
- What technologies will I use?
- How are components organized?
- What's the data model?
- How do parts communicate?
- What are the key architectural decisions?

Work with AI to explore:
```
Given these requirements, what architectural approaches would work?
Suggest 2-3 options with tradeoffs.
```

#### Rules Document (~15 minutes)
Ask yourself:
- What coding style?
- What testing approach?
- What file organization?
- What patterns to use/avoid?
- What tools and dependencies?

Work with AI to establish:
```
For a [language/framework] project, what rules should I establish?
Here's my draft: [paste rules]
```

## Template Structure

```
template/minimal/
├── README.md              # This file
└── docs/
    └── templates.md       # All 4 document templates
```

## Customization

### Minimal Variations

**For very simple projects** (< 10 files):
- Combine requirements + design into one doc
- Keep vision + rules separate
- Result: 3 documents instead of 4

**For exploratory projects**:
- Keep vision light (it will evolve)
- Focus on rules (maintain consistency)
- Update requirements/design frequently

**For learning projects**:
- Detailed rules (forces learning)
- Lighter design (AI suggests patterns)
- Vision focuses on learning goals

## Examples

See [examples/minimal/](../../examples/minimal/) for a complete working example using these templates to build a FastAPI Hello World.

## Tips

### Writing Good Vision Documents
- Be specific about users and use cases
- Define success criteria clearly
- Explicitly state what's out of scope
- Keep it to 1-2 pages maximum

### Writing Good Requirements
- Use "must", "should", "may" clearly
- Number requirements for reference
- Separate functional from non-functional
- Include validation rules

### Writing Good Design Documents
- Choose technologies early (guides AI)
- Diagram component relationships (ASCII art works!)
- Define data models explicitly
- Document key tradeoffs and decisions

### Writing Good Rules Documents
- Be specific about style (linter config is great)
- Define project structure upfront
- Specify testing requirements
- List approved/forbidden patterns

## Common Mistakes

### ❌ Too Vague
```markdown
# Vision
We're building a cool app for users.
```
AI can't work with this. Be specific!

### ❌ Too Detailed Too Soon
```markdown
# Design
Line 47 should use algorithm X with parameters Y and Z...
```
This is over-specification. Focus on architecture, not implementation.

### ❌ Contradictory Documents
```markdown
# Requirements: "Must support 1000 concurrent users"
# Design: "Use in-memory storage"
```
These conflict! AI will get confused. Keep docs consistent.

### ❌ Stale Documentation
```markdown
# Last updated: 3 months ago
# Code diverged significantly since then
```
Update docs when decisions change. Stale docs are worse than no docs.

## Next Steps

After using this template:

1. **Implement with AI** - Share docs and start building
2. **Iterate** - Update docs as decisions evolve
3. **Evaluate** - Did Context Hive help? What would you change?
4. **Share** - Contribute your experience back to the project

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for how to share your learnings.

## Getting Help

- Read the [Getting Started Guide](../../docs/getting-started.md) for a full walkthrough
- Check [THEORY.md](../../THEORY.md) for deeper concepts
- Review [examples/minimal/](../../examples/minimal/) for a working example
- Open a [GitHub Discussion](https://github.com/yourusername/context-hive/discussions) for questions

---

**Ready to start?** Copy the templates from [docs/templates.md](docs/templates.md) and begin your Context Hive journey!
