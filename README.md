# Context Hive

**AI as Team Member from Day 0** - A practical approach to AI-driven development

Context Hive is a development methodology and template collection that treats AI as a full team member from the very beginning of a project (Day 0 / Phase 0). Instead of using AI as a tool, we collaborate with AI through comprehensive documentation that serves as shared context.

## Core Philosophy

- **AI joins from Day 0**: AI participates in the project from the pre-start phase, not as an afterthought
- **Documentation as shared context**: Vision, requirements, design, and rules serve as the foundation for AI collaboration
- **Practical, not perfect**: We share real experiences, including failures and limitations
- **Scale limits unknown**: We're honest about what we don't know yet

## Core Architecture

Context Hive is built around three key components working together:

```
┌─────────────────────────────────────────────────────────────┐
│                     Phase 0: Pre-Start                      │
│                                                             │
│  ┌───────────┐  ┌──────────────┐  ┌────────┐  ┌─────────┐│
│  │ Vision.md │──│Requirements  │──│Design  │──│Rules.md ││
│  │           │  │    .md       │  │  .md   │  │         ││
│  └───────────┘  └──────────────┘  └────────┘  └─────────┘│
│        │                │               │            │     │
│        └────────────────┼───────────────┼────────────┘     │
│                         ▼               ▼                  │
└─────────────────────────┼───────────────┼──────────────────┘
                          │               │
                          ▼               ▼
              ┌───────────────────────────────────┐
              │           Hub System              │
              │  ┌─────────────────────────────┐ │
              │  │  build_graph.py             │ │
              │  │  validate_context.py        │ │
              │  │  gen_reading_list.py        │ │
              │  └─────────────────────────────┘ │
              │                                   │
              │  Generates:                      │
              │  - Dependency graph (graph.json)  │
              │  - Visualizations (graph.mmd)     │
              │  - Reading lists per task         │
              └───────────────┬───────────────────┘
                              │
                              ▼
           ┌──────────────────────────────────────────┐
           │         Service Layer                   │
           │                                          │
           │  ┌────────────┐      ┌────────────┐   │
           │  │ Service A  │      │ Service B  │   │
           │  │            │      │            │   │
           │  │ ├─app/     │      │ ├─app/     │   │
           │  │ ├─tests/   │      │ ├─tests/   │   │
           │  │ └─tasks/   │      │ └─tasks/   │   │
           │  └────────────┘      └────────────┘   │
           └──────────────────────────────────────────┘
```

### How It Works

1. **Phase 0 (Pre-Start)**: Write four pillar documents
   - Vision: Project goals and purpose
   - Requirements: What needs to be built
   - Design: How it will be built
   - Rules: Development standards

2. **Hub**: Manages context and dependencies
   - Scans service metadata (`service.meta.yaml`)
   - Generates dependency graphs
   - Creates optimized reading lists for AI
   - Validates consistency

3. **Services**: Implement features with AI
   - Each service declares its dependencies
   - Tasks reference specific documents
   - AI reads in optimal order (via reading lists)
   - Humans review and iterate

### Key Benefit

**Traditional approach**: AI gets code snippets → makes mistakes → constant corrections

**Context Hive**: AI gets complete context → autonomous implementation → minimal corrections

## Quick Start (30 minutes)

1. **Read the getting started guide**: [docs/getting-started.md](docs/getting-started.md)
2. **Try the minimal example**: [examples/minimal/](examples/minimal/)
3. **Use the template**: [template/minimal/](template/minimal/)

## Documentation

### Getting Started
- [Getting Started](docs/getting-started.md) - Complete beginner's guide
- [Theory](THEORY.md) - Core concepts and methodology
- [Applicability](APPLICABILITY.md) - When to use Context Hive

### Core Concepts
- [Core Concepts](docs/concepts.md) - AI as team member, Hub architecture, COPA methodology
- [Philosophy](docs/philosophy.md) - Design decisions and rationale
- [5-Phase Process](docs/process.md) - Detailed development workflow
- [Best Practices](docs/best-practices.md) - Practical guidelines

### Comparisons
- [Context Hive vs. Other Approaches](docs/comparison.md) - How we compare to alternatives

### Contributing
- [Contributing](CONTRIBUTING.md) - How to contribute

## What's Inside

### Hub: Context Management System
- **Hub Tools** ([hub/tools/](hub/tools/)) - Python scripts for managing context
  - `build_graph.py` - Generate dependency graphs
  - `validate_context.py` - Validate context consistency
  - `gen_reading_list.py` - Generate AI reading lists
- **Hub Metadata** ([hub/meta/](hub/meta/)) - Generated graphs and reading lists
  - `graph.json` - Machine-readable dependency graph
  - `graph.mmd` - Mermaid visualization
  - `reading_lists/` - Generated reading orders for AI

### Services
- **Sample Service** ([services/sample_service/](services/sample_service/)) - Example service structure
  - Service metadata (`service.meta.yaml`)
  - Task definitions
  - Implementation example

### Templates
- **Minimal Template** ([template/minimal/](template/minimal/)) - The essential 4-document starter kit
  - Vision document
  - Requirements document
  - Design document
  - Rules document

### Examples
- **Minimal Example** ([examples/minimal/](examples/minimal/)) - A working FastAPI Hello World built with Context Hive
  - Complete documentation set
  - Implementation code
  - Tests

### Scripts
- **Init Script** ([scripts/init-project.sh](scripts/init-project.sh)) - Initialize a new Context Hive project

## Project Structure

```
context-hive/
├── README.md                    # This file
├── THEORY.md                    # Core methodology
├── APPLICABILITY.md             # When to use this approach
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # License information
├── requirements.txt             # Python dependencies
│
├── docs/                        # Documentation
│   ├── getting-started.md       # 30-minute tutorial
│   ├── concepts.md              # Core concepts and Hub architecture
│   ├── philosophy.md            # Design decisions and rationale
│   ├── process.md               # 5-phase development process
│   ├── comparison.md            # vs. other approaches
│   └── best-practices.md        # Practical guidelines
│
├── hub/                         # Hub: Context Management System
│   ├── README.md                # Hub documentation
│   ├── meta/                    # Generated metadata
│   │   ├── graph.json           # Dependency graph (machine-readable)
│   │   ├── graph.mmd            # Dependency graph (Mermaid)
│   │   └── reading_lists/       # Generated AI reading lists
│   └── tools/                   # Hub management tools
│       ├── build_graph.py       # Generate dependency graph
│       ├── validate_context.py  # Validate context consistency
│       └── gen_reading_list.py  # Generate reading lists
│
├── services/                    # Service implementations
│   └── sample_service/          # Example service
│       ├── README.md            # Service documentation
│       ├── service.meta.yaml    # Service metadata
│       ├── app/                 # Implementation
│       └── tasks/               # Task definitions
│
├── scripts/                     # Utility scripts
│   └── init-project.sh          # Project initialization script
│
├── template/
│   └── minimal/                 # Minimal template (4 documents)
│       ├── README.md
│       └── docs/
│           └── templates.md
│
└── examples/
    └── minimal/                 # Working example
        ├── README.md
        ├── docs/               # 4 core documents
        └── src/                # Implementation
```

## Key Principles

1. **Phase 0: Pre-start** - AI joins before coding begins
2. **Documentation First** - Create shared context before implementation
3. **Iterative Collaboration** - AI and humans iterate together
4. **Learning from Failures** - We welcome and share failure stories

## When to Use Context Hive

Context Hive works well for:
- Greenfield projects starting from scratch
- Projects with clear business goals
- Teams open to AI collaboration
- Iterative development processes

See [APPLICABILITY.md](APPLICABILITY.md) for detailed guidance.

## Development Setup

### For Contributors

If you want to contribute to Context Hive itself, follow these steps:

```bash
# Clone the repository
git clone https://github.com/Petsuro85/context-hive.git
cd context-hive

# Switch to develop branch
git checkout develop

# Run the bootstrap script to set up your environment
bash scripts/bootstrap_dev.sh

# This will:
# - Create a Python virtual environment
# - Install all dependencies
# - Set up pre-commit hooks
# - Run initial validation
```

### Development Workflow

Context Hive uses a **develop → master** workflow:

- **develop**: Active development branch where all work happens
- **master**: Protected production branch for public releases

**Before submitting changes:**
```bash
# Run full validation suite
bash scripts/validate_all.sh

# This runs:
# - Schema validation (strict mode)
# - Dependency graph generation
# - Reading list generation
```

### Useful Scripts

```bash
# Generate reading list for a service/task
bash scripts/make_readinglist.sh sample_service implement_api

# Generate release notes from commits
bash scripts/release_notes.sh

# Bootstrap development environment
bash scripts/bootstrap_dev.sh
```

### Pre-commit Hooks

Pre-commit hooks automatically run on every commit to ensure code quality:
- Python: black (formatting), ruff (linting), mypy (type checking)
- Markdown: mdformat (formatting)
- General: trailing whitespace, YAML/JSON validation

If hooks fail, fix the issues and commit again.

## Contributing

We welcome contributions! This includes:
- Success stories and case studies
- Failure stories and lessons learned
- Template improvements
- Documentation enhancements
- Translation

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Community

- Issues: [GitHub Issues](https://github.com/Petsuro85/context-hive/issues)
- Discussions: [GitHub Discussions](https://github.com/Petsuro85/context-hive/discussions)

---

**Remember**: AI as team member, not as tool. Documentation as shared context, not as burden.
