# Applicability: When to Use Context Hive

Context Hive is not a silver bullet. This document helps you determine if this methodology is right for your project.

## Quick Decision Tree

```
Is this a greenfield project? ──NO──> Consider other approaches
         │                            (retrofitting is harder)
        YES
         │
Do you have clear goals? ──NO──> Wait until goals crystallize
         │                       (vague goals = poor docs)
        YES
         │
Are you willing to write ──NO──> Context Hive won't work
and maintain 4 documents?        (documentation is essential)
         │
        YES
         │
Is your team open to ──NO──> Start with education
AI collaboration?            (culture change needed)
         │
        YES
         │
    ✅ Context Hive is likely a good fit!
```

## Ideal Use Cases

### 1. Greenfield Projects
**Why it works**: Starting from scratch means no legacy baggage. You can establish Context Hive patterns from Day 0.

**Example scenarios**:
- New microservice in an existing ecosystem
- Proof-of-concept for new product
- Internal tool development
- Side project or startup MVP

**Success indicators**:
- Empty repository or fresh start
- Freedom to choose tech stack
- No existing codebase to integrate with

### 2. Well-Defined Problems
**Why it works**: Clear problems lead to clear documentation. AI works best with unambiguous requirements.

**Example scenarios**:
- "Build a REST API for task management"
- "Create a CLI tool for data migration"
- "Implement OAuth authentication flow"

**Success indicators**:
- You can articulate the problem in one sentence
- Success criteria are measurable
- Users and use cases are known

### 3. Learning Projects
**Why it works**: Documentation forces deep understanding. AI collaboration accelerates learning.

**Example scenarios**:
- Learning new framework or language
- Exploring architectural patterns
- Understanding best practices
- Building portfolio projects

**Success indicators**:
- Learning is a primary goal
- Failure is acceptable
- Time to experiment and iterate

### 4. Small to Medium Scope
**Why it works**: Context Hive's effectiveness at large scale is unproven. Start small.

**Example scenarios**:
- Single service (not entire platform)
- 10-50 files initially
- 1-4 week initial implementation
- Clear scope boundaries

## 不適用ケース
- ドキュメント整備にリソースを割けない、または継続的なメンテナンスが難しい。
- レガシーコードの改修プロジェクトで、既存コンテキストが整理されていない。
- 実験的なプロトタイピングで要件が頻繁に変わり、長期的な整合性より速度を優先する。
- セキュリティやコンプライアンス要件が未整理で、参照すべきルールが定義されていない。

**Success indicators**:
- Can describe entire system in 2-3 pages
- Limited number of integrations
- Manageable complexity

## Challenging Use Cases

### 1. Legacy Codebases
**Challenge**: Retrofitting documentation to existing code is harder than creating both together.

**Mitigation strategies**:
- Start with new features/modules
- Document incrementally
- Use Context Hive for refactoring efforts
- Don't try to document everything at once

**Decision**: Proceed with caution. Consider hybrid approach.

### 2. Rapidly Changing Requirements
**Challenge**: Documentation becomes stale quickly if requirements change daily.

**Mitigation strategies**:
- Use living documents that update frequently
- Accept some lag between reality and docs
- Focus on stable aspects (architecture, patterns)
- Use lightweight documentation format

**Decision**: May work with high documentation discipline.

### 3. Large Teams
**Challenge**: Many contributors can lead to documentation conflicts and inconsistency.

**Mitigation strategies**:
- Designate documentation owner
- Use pull request reviews for doc changes
- Establish clear update protocols
- Consider doc-per-component instead of monolithic

**Decision**: Unproven at scale. Experiment cautiously.

### 4. Highly Exploratory Projects
**Challenge**: "Figure out what to build" doesn't provide enough structure for documentation.

**Mitigation strategies**:
- Use Phase 0 for exploration with AI
- Document hypotheses and experiments
- Iterate docs frequently as understanding grows
- Accept that early docs will be wrong

**Decision**: Can work if you embrace iteration.

## Anti-Patterns (Don't Use Context Hive If...)

> **⚠️ WARNING: When NOT to Use Context Hive**
>
> Context Hive requires upfront investment in documentation and team commitment
> to maintaining that documentation. If your project or team cannot support this,
> Context Hive will feel like burden rather than benefit. Be honest about your
> constraints before adopting this methodology.

### ❌ No Time for Documentation
If you think "I'll just code it quickly", Context Hive will feel like overhead. The methodology requires upfront documentation investment.

**Alternative**: Traditional AI-as-tool approach with inline prompts.

### ❌ Documentation-Averse Culture
If your team resists writing docs or sees them as bureaucracy, Context Hive won't be adopted.

**Alternative**: Introduce gradually, demonstrate value first.

### ❌ Unclear Problem Space
If you can't articulate what you're building and why, documentation will be meaningless.

**Alternative**: Do more discovery work first. Context Hive can help once direction is clear.

### ❌ Zero AI Trust
If your team fundamentally distrusts AI-generated code, the methodology won't be embraced.

**Alternative**: Start with AI for non-critical tasks, build trust gradually.

### ❌ Regulatory Constraints
If regulations prohibit AI involvement in development, Context Hive is not applicable.

**Alternative**: Use documentation patterns for human collaboration.

## Project Size Guidelines

### Micro Projects (1-10 files)
**Applicability**: ✅ Excellent

Context Hive is proven at this scale. The 4-document overhead is minimal, and AI can hold entire project context.

**Example**: Single-purpose CLI tool, simple API, utility library

### Small Projects (10-50 files)
**Applicability**: ✅ Good

Context Hive works well. Documentation remains manageable. AI can understand most of the codebase.

**Example**: Web service, mobile app feature, data pipeline

### Medium Projects (50-200 files)
**Applicability**: ⚠️ Unknown

Limited real-world data. Documentation may need to be modular (doc-per-module). AI context limits may become relevant.

**Example**: Full application, multiple services, complete platform feature

### Large Projects (200+ files)
**Applicability**: ❓ Unproven

No validated patterns yet. Documentation structure needs to be hierarchical. AI context management becomes critical.

**Example**: Enterprise platform, multi-team system, large monolith

**Recommendation**: Start with Context Hive for new modules within large projects, not entire codebase.

## Technology Stack Considerations

### Programming Languages
**Best**: Modern languages with strong AI training data
- Python, JavaScript/TypeScript, Java, Go, Rust

**Good**: Popular languages with adequate AI knowledge
- C#, Ruby, PHP, Swift, Kotlin

**Challenging**: Niche or legacy languages
- COBOL, Fortran, obscure DSLs

### Frameworks
**Best**: Popular, well-documented frameworks
- FastAPI, Express, React, Django, Spring Boot

**Good**: Established frameworks with community support
- Flask, Vue, Angular, Rails

**Challenging**: Custom or proprietary frameworks

### Architecture Patterns
**Best**: Standard, well-understood patterns
- REST APIs, MVC, microservices, serverless

**Good**: Common but more complex patterns
- Event-driven, CQRS, hexagonal architecture

**Challenging**: Novel or highly custom architectures

## Team Considerations

### Team Size
**1-2 developers**: ✅ Ideal (low coordination overhead)
**3-5 developers**: ✅ Good (manageable doc conflicts)
**6-10 developers**: ⚠️ Challenging (requires strong process)
**10+ developers**: ❓ Unproven (documentation governance needed)

### Team Experience
**Junior developers**: ✅ Excellent (learning accelerator)
**Mid-level developers**: ✅ Excellent (productivity multiplier)
**Senior developers**: ✅ Good (may resist documentation initially)
**Mixed team**: ✅ Excellent (docs level knowledge)

### Team Location
**Co-located**: ✅ Good (easy communication)
**Distributed**: ✅ Excellent (docs as async communication)
**Across timezones**: ✅ Excellent (docs bridge time gaps)

## Success Metrics

How to know if Context Hive is working for you:

### Positive Indicators
- AI implementations match requirements without extensive rework
- New team members onboard quickly via documentation
- Technical debt remains manageable
- Documentation stays updated (not stale)
- Team refers to docs regularly
- AI generates consistent, pattern-following code

### Warning Signs
- Documentation is rarely updated
- AI implementations require frequent corrections
- Team doesn't read docs (just prompts AI directly)
- Docs and code diverge significantly
- More time spent on docs than code
- Team complains about documentation burden

## Experimentation Guidelines

If you're unsure whether Context Hive fits your project:

### Start Small
- Choose one feature or module
- Create the 4 core documents for just that scope
- Implement with AI using the docs
- Evaluate results after 1-2 weeks

### Measure Impact
Track these metrics:
- Time to first working implementation
- Number of AI-generated code revisions needed
- Team satisfaction with documentation
- Documentation staleness (days since last update)
- Defect rate in AI-generated vs human code

### Iterate or Abandon
After experimentation:
- **If positive**: Expand to more modules
- **If mixed**: Adjust documentation style/depth
- **If negative**: Context Hive may not fit this project

## Case Studies (Hypothetical)

### ✅ Success Story: Task Management API
- **Context**: Greenfield microservice, 2 developers, Python/FastAPI
- **Outcome**: 4 documents created in 4 hours. Implementation completed in 2 days with 85% AI-generated code. Minimal rework needed.
- **Key Factor**: Clear requirements, standard technology stack

### ⚠️ Mixed Result: E-commerce Platform
- **Context**: Large project, 8 developers, multiple services
- **Outcome**: Documentation became fragmented. Some modules succeeded, others struggled with consistency.
- **Key Factor**: Needed better documentation governance at scale

### ❌ Failure Story: Exploratory Data Science
- **Context**: Research project with evolving goals, 3 data scientists
- **Outcome**: Documentation couldn't keep up with experimentation pace. Became a burden rather than help.
- **Key Factor**: Too much uncertainty for upfront documentation

## Final Recommendation

Context Hive is most likely to succeed when:

1. ✅ Greenfield or new module in existing project
2. ✅ Clear problem and success criteria
3. ✅ Team willing to invest in documentation
4. ✅ Small to medium scope (< 50 files initially)
5. ✅ Standard technology stack
6. ✅ Team open to AI collaboration

If 4 or more apply to your project, Context Hive is worth trying.

If 2 or fewer apply, consider alternative approaches or wait until conditions change.

---

**Remember**: When in doubt, experiment small. The cost of trying Context Hive on one feature is low. Start there.
