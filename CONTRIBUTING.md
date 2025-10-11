# Contributing to Context Hive

We welcome contributions from everyone! Context Hive is a community-driven methodology, and it grows stronger through shared experiences, improvements, and diverse perspectives.

## What We're Looking For

### 1. Case Studies and Experience Reports
**Most valuable contribution!**

Share your real-world experiences using Context Hive:
- **Success stories**: What worked well and why
- **Failure stories**: What didn't work and lessons learned
- **Mixed results**: Partial successes with insights
- **Scale experiments**: Testing limits and boundaries

**Format**: Create a file in `case-studies/` directory with:
```markdown
# Project Name (can be anonymized)

## Context
- Project type
- Team size
- Technology stack
- Duration

## Approach
How you used Context Hive

## Results
What happened (be honest!)

## Lessons
What you learned

## Artifacts (optional)
Sanitized versions of your documents
```

### 2. Template Improvements
Enhance existing templates or create new ones:
- Better wording for clarity
- Additional sections
- Language-specific variations
- Domain-specific templates (web, mobile, ML, etc.)

### 3. Examples
Add more working examples:
- Different technology stacks
- Different project types
- Different scales
- Different domains

### 4. Documentation
Improve clarity and accessibility:
- Fix typos and grammar
- Add diagrams and visuals
- Improve explanations
- Translate to other languages

### 5. Tools and Integrations
Build tools that support Context Hive:
- IDE plugins
- CLI tools
- Documentation generators
- CI/CD integrations
- AI model fine-tuning

## How to Contribute

### Quick Contributions (No PR needed)
For small fixes and suggestions:
1. Open an issue describing the improvement
2. We'll discuss and potentially implement

### Standard Contributions (PR workflow)
For substantial changes:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/context-hive.git
   cd context-hive
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-contribution-name
   ```

3. **Make your changes**
   - Follow existing document structure
   - Maintain consistent tone (practical, honest, no hype)
   - Test examples work as documented

4. **Commit with clear messages**
   ```bash
   git commit -m "Add case study for e-commerce API project"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-contribution-name
   ```
   Then open PR on GitHub

### Case Study Contributions
To contribute a case study:

1. Create file in `case-studies/YYYY-MM-project-name.md`
2. Use the template in `case-studies/_TEMPLATE.md`
3. Be honest - failures are as valuable as successes
4. Anonymize if needed, but keep technical details accurate
5. Include artifacts if possible (sanitized docs)

### Template Contributions
To improve or add templates:

1. Existing templates: Submit changes to `template/*/`
2. New templates: Create new directory under `template/`
3. Include:
   - `README.md` explaining when to use
   - `docs/templates.md` with all 4 core document templates
   - Example or reference implementation

### Example Contributions
To add new examples:

1. Create directory under `examples/your-example-name/`
2. Include complete set:
   - `README.md` explaining the example
   - `docs/` with all 4 core documents
   - `src/` with working implementation
   - `tests/` if applicable
3. Ensure it runs successfully
4. Document setup steps clearly

## Contribution Guidelines

### Writing Style
- **Tone**: Practical, honest, professional
- **Language**: Clear and accessible (avoid jargon when possible)
- **Perspective**: First-person plural ("we") or second person ("you")
- **Length**: Concise but complete
- **Format**: Markdown with clear hierarchy

### Content Principles

#### ✅ Do
- Be honest about limitations and unknowns
- Share failures and lessons learned
- Provide concrete examples
- Explain the "why" behind recommendations
- Use simple, clear language
- Include code samples where helpful
- Credit sources and inspirations

#### ❌ Don't
- Oversell or hype the methodology
- Make unsubstantiated claims
- Use AI-generated content without review
- Include proprietary or confidential information
- Add unnecessary complexity
- Assume advanced knowledge without explanation

### Technical Requirements

#### For Examples
- Code must run successfully
- Include setup instructions
- List all dependencies
- Test on clean environment
- Use widely-available tools

#### For Templates
- Clear section headings
- Instructional comments where helpful
- Fill-in-the-blank style where appropriate
- Multiple examples for clarity

#### For Documentation
- Proper markdown formatting
- Working internal links
- Alt text for images
- Mobile-friendly layout

## What Gets Merged

### High Priority (Fast Review)
- Case studies with real data
- Bug fixes in existing docs
- Clarifications and improvements
- Working examples with complete docs

### Medium Priority
- New templates for common scenarios
- Tool integrations
- Translations
- Visual aids and diagrams

### Low Priority (May Take Time)
- Speculative additions
- Unproven patterns
- Large refactorings
- Experimental features

### Won't Merge
- AI-generated content without human review
- Marketing or promotional material
- Off-topic contributions
- Proprietary tools or lock-in
- Content violating code of conduct

## Case Study Anonymization

If sharing proprietary projects:

### What to Anonymize
- Company names
- Product names
- Customer names
- Specific business metrics
- Internal tools and systems
- People names (except with permission)

### What to Keep Accurate
- Technology stack
- Project scale (file count, team size)
- Timeline and duration
- Technical challenges
- Results and outcomes
- Code patterns and architecture

### Example
```
❌ "We built Acme Corp's customer portal using their internal XYZ framework"
✅ "We built an enterprise customer portal using a proprietary Java framework"
```

## Review Process

### For Case Studies
1. Verify completeness (all sections filled)
2. Check for anonymization if needed
3. Validate lessons are actionable
4. Confirm honest representation
5. Publish within 1 week

### For Code/Examples
1. Test that code runs
2. Verify documentation accuracy
3. Check for security issues
4. Validate style consistency
5. Request changes or approve

### For Documentation
1. Check accuracy
2. Verify clarity
3. Test links
4. Validate formatting
5. Approve or suggest improvements

## Community Standards

### Code of Conduct
- Be respectful and professional
- Welcome diverse perspectives
- Focus on ideas, not people
- Assume good intent
- Help newcomers
- Give constructive feedback

### Communication Channels
- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, general discussion
- **Pull Requests**: Code and doc contributions

### Response Times
We aim for:
- Issue acknowledgment: 48 hours
- Case study review: 1 week
- PR feedback: 1 week
- Merge decision: 2 weeks

(These are goals, not guarantees - this is volunteer-driven)

## Recognition

### Contributors
All contributors are recognized in:
- `CONTRIBUTORS.md` file
- Release notes for significant contributions
- Case study author credit

### Types of Recognition
- 🏆 **Case Study Contributor**: Shared experience report
- 🔧 **Tool Builder**: Created integration or tool
- 📝 **Documentation Improver**: Enhanced clarity
- 💡 **Template Creator**: Added new template
- 🐛 **Bug Reporter**: Found and reported issues
- 🌍 **Translator**: Translated content

## Getting Help

### Questions About Contributing
- Open a GitHub Discussion
- Tag with "contribution-question"
- We'll respond within 48 hours

### Technical Questions
- Check existing documentation first
- Search closed issues
- Open new issue with "question" label

### Proposing Major Changes
- Open issue describing proposal
- Discuss approach before implementing
- Get feedback on direction
- Then submit PR

## Legal

### Licensing
By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

### Copyright
You retain copyright to your contributions, but grant Context Hive the right to distribute them under the project license.

### Originality
You confirm that:
- Contributions are your original work
- You have rights to contribute the content
- No proprietary or confidential info included (unless anonymized)

## First-Time Contributors

Welcome! Here's how to start:

1. **Read the docs**: Understand Context Hive methodology
2. **Try it yourself**: Use it on a small project
3. **Start small**: Fix a typo, improve wording, add clarification
4. **Ask questions**: We're here to help
5. **Share experience**: Even small experiments are valuable

### Good First Contributions
- Fix typos or grammar
- Improve example comments
- Add clarifying sentences
- Suggest better wording
- Report confusing sections

## Thank You!

Every contribution, large or small, makes Context Hive better for everyone. We appreciate:
- Your time and effort
- Your honesty in sharing experiences
- Your patience with the review process
- Your commitment to the community

Together, we're exploring how to work effectively with AI as team members. Your contributions help us all learn and improve.

---

**Questions?** Open an issue or discussion. We're happy to help!
