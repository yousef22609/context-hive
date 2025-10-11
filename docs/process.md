# The 5-Phase Development Process

Context Hive organizes development into five distinct phases, each with clear deliverables and transitions. This document details each phase.

## Overview

```
Phase 0: Pre-start     (Documentation)
   ↓
Phase 1: Requirements  (Human-led)
   ↓
Phase 2: Documentation (AI-assisted)
   ↓
Phase 3: Implementation (AI-driven)
   ↓
Phase 4: Verification  (Human + AI)
   ↓
Phase 5: Deployment    (Human-approved)
```

## Phase 0: Pre-start

**Primary Goal**: Prepare comprehensive context before any code is written

**Who leads**: Human stakeholders and architects

**AI involvement**: Optional - can help draft initial documents

### Activities

1. **Vision definition**
   - What problem are we solving?
   - Who are the users?
   - What does success look like?

2. **Requirements gathering**
   - Functional requirements
   - Non-functional requirements
   - Constraints and assumptions
   - Acceptance criteria

3. **Architecture design**
   - System components and services
   - Technology stack decisions
   - API contracts
   - Data models
   - Infrastructure requirements

4. **Rules establishment**
   - Coding standards
   - Testing requirements
   - Security guidelines
   - Review processes

5. **Context preparation**
   - Organize documents
   - Create service structure
   - Generate initial dependency graph
   - Validate all references

### Deliverables

- ✅ `docs/vision.md` - Complete project vision
- ✅ `docs/requirements.md` - Comprehensive requirements
- ✅ `docs/design.md` - Detailed architecture design
- ✅ `docs/rules.md` - Development standards
- ✅ `services/*/service.meta.yaml` - Service metadata for all planned services
- ✅ `hub/meta/graph.json` - Initial dependency graph
- ✅ Validation passing (`python hub/tools/validate_context.py`)

### Exit Criteria

- [ ] All four pillar documents exist and are complete
- [ ] All services are defined with metadata
- [ ] Dependency graph is generated and validated
- [ ] Stakeholders have reviewed and approved all documents
- [ ] Reading lists can be generated for initial tasks

### Common Pitfalls

- **Rushing through Phase 0**: Taking shortcuts here creates problems later
- **Incomplete requirements**: Vague requirements lead to vague implementations
- **Missing validation**: Broken references cause AI confusion
- **No stakeholder alignment**: Disagreements surface during implementation (expensive)

### Time Investment

Typical Phase 0 duration: **10-20% of total project time**

This might feel like a lot, but it:
- Prevents costly rework
- Enables AI autonomy
- Improves code quality
- Reduces total project time

## Phase 1: Requirements (Human-led)

**Primary Goal**: Refine and validate requirements through human review

**Who leads**: Product owners, business analysts, stakeholders

**AI involvement**: Minimal - may help clarify ambiguous requirements

### Activities

1. **Requirements review**
   - Walk through each requirement
   - Ensure testability
   - Identify missing requirements
   - Resolve conflicts

2. **Prioritization**
   - Order features by business value
   - Identify MVP scope
   - Define release milestones

3. **Acceptance criteria definition**
   - How will we know when requirements are met?
   - What tests need to pass?
   - What metrics define success?

4. **Risk assessment**
   - Technical risks
   - Business risks
   - Dependencies on external systems
   - Mitigation strategies

### Deliverables

- ✅ Updated `docs/requirements.md` with:
  - Prioritized requirements
  - Clear acceptance criteria
  - Risk assessment
  - Dependencies identified

### Exit Criteria

- [ ] All requirements are specific and testable
- [ ] Acceptance criteria are defined for each requirement
- [ ] Priorities are agreed upon
- [ ] Risks are identified with mitigation plans
- [ ] Stakeholders sign off

### Time Investment

Typical duration: **5-10% of total project time**

## Phase 2: Documentation (AI-assisted)

**Primary Goal**: Complete detailed documentation with AI assistance

**Who leads**: Technical leads and architects

**AI involvement**: High - AI helps draft detailed documentation

### Activities

1. **API specification**
   - Define all endpoints
   - Request/response schemas
   - Error handling
   - Authentication/authorization

2. **Data modeling**
   - Database schemas
   - Data relationships
   - Migration strategies
   - Data validation rules

3. **Component design**
   - Class/module structure
   - Interfaces and contracts
   - State management
   - Event flows

4. **Testing strategy**
   - Unit test approach
   - Integration test approach
   - E2E test scenarios
   - Performance test criteria

5. **Reading list generation**
   ```bash
   # Generate reading lists for all implementation tasks
   for service in services/*/; do
       for task in $(yq '.tasks | keys' $service/service.meta.yaml); do
           python hub/tools/gen_reading_list.py $(basename $service) $task
       done
   done
   ```

### AI Prompts for This Phase

**Example prompt for API documentation**:
```
Given the requirements in docs/requirements.md and the design in docs/design.md,
generate detailed API documentation for the [service_name] service.

Include:
- All endpoints (method, path, description)
- Request/response schemas
- Error responses
- Authentication requirements
- Rate limiting

Follow the format in docs/rules.md.
```

### Deliverables

- ✅ Detailed API documentation
- ✅ Complete data models
- ✅ Component design documents
- ✅ Testing strategy
- ✅ Reading lists for all implementation tasks

### Exit Criteria

- [ ] All APIs are fully specified
- [ ] All data models are defined
- [ ] Testing strategy is clear
- [ ] Reading lists are generated and validated
- [ ] Technical review completed

### Time Investment

Typical duration: **15-20% of total project time**

## Phase 3: Implementation (AI-driven)

**Primary Goal**: Implement code with AI doing the bulk of the work

**Who leads**: AI (supervised by developers)

**AI involvement**: Primary - AI implements most code

### Activities

1. **Task-by-task implementation**
   ```bash
   # For each task:

   # 1. Generate reading list
   python hub/tools/gen_reading_list.py service_name task_name

   # 2. AI reads documents in order
   # (feed reading list to AI)

   # 3. AI implements the task
   # (AI writes code based on context)

   # 4. Human reviews implementation
   # 5. Iterate if needed
   ```

2. **Code generation**
   - Service implementation
   - API endpoints
   - Database interactions
   - Business logic
   - Error handling

3. **Test writing**
   - Unit tests
   - Integration tests
   - Test fixtures and mocks

4. **Documentation updates**
   - Code comments
   - README updates
   - API documentation refinements

### AI Workflow for Implementation

**Step 1: Load context**
```
Read the following documents in order:
1. [Document 1 from reading list]
2. [Document 2 from reading list]
...

After reading, implement [task description].
```

**Step 2: Implement feature**
- AI writes code following design docs
- AI writes tests following testing strategy
- AI updates relevant documentation

**Step 3: Human review**
- Check implementation against requirements
- Verify tests pass
- Review code quality
- Approve or request changes

### Deliverables

- ✅ Implemented code for all services
- ✅ Comprehensive test suite
- ✅ Updated documentation
- ✅ All tests passing

### Exit Criteria

- [ ] All planned features are implemented
- [ ] Test coverage meets requirements (typically >80%)
- [ ] All tests pass
- [ ] Code review completed
- [ ] Documentation is current

### Common Pitfalls

- **Skipping reading lists**: AI gets wrong context → makes mistakes
- **Insufficient review**: Trusting AI output without verification
- **Outdated documents**: Documents change but graph isn't regenerated
- **Test neglect**: AI implements features but tests are superficial

### Time Investment

Typical duration: **40-50% of total project time**

Despite AI doing most coding, time is spent on:
- Context loading
- Review and iteration
- Test execution
- Integration debugging

## Phase 4: Verification (Human + AI)

**Primary Goal**: Comprehensive testing and validation

**Who leads**: QA engineers and developers

**AI involvement**: Medium - AI helps write tests and debug issues

### Activities

1. **Test execution**
   - Run full test suite
   - Performance testing
   - Security testing
   - Compatibility testing

2. **Bug fixing**
   - Identify issues
   - Reproduce bugs
   - Fix (with AI assistance)
   - Verify fixes

3. **Integration testing**
   - Service-to-service communication
   - External API integration
   - Database interactions
   - Error handling across boundaries

4. **User acceptance testing**
   - Stakeholder review
   - Feature validation against requirements
   - UX testing
   - Edge case validation

5. **Documentation validation**
   - Ensure docs match implementation
   - Update any discrepancies
   - Add operational documentation

### AI Assistance in This Phase

**Bug reproduction**:
```
Given this bug report: [description]
And these error logs: [logs]

Reproduce the bug and provide:
1. Minimal reproduction steps
2. Root cause analysis
3. Proposed fix
```

**Test generation**:
```
Generate additional test cases for [feature]
that cover:
1. Edge cases
2. Error conditions
3. Performance boundaries
```

### Deliverables

- ✅ All tests passing
- ✅ Bug fixes committed
- ✅ Integration validated
- ✅ Acceptance criteria met
- ✅ Documentation validated and current

### Exit Criteria

- [ ] All tests pass (unit, integration, E2E)
- [ ] No critical or high-severity bugs
- [ ] Performance meets requirements
- [ ] Security scan passes
- [ ] Stakeholder acceptance obtained

### Time Investment

Typical duration: **15-20% of total project time**

## Phase 5: Deployment (Human-approved)

**Primary Goal**: Deploy to production safely and reliably

**Who leads**: DevOps/SRE engineers

**AI involvement**: Low - AI may help with deployment scripts but humans control the process

### Activities

1. **Deployment preparation**
   - Environment configuration
   - Infrastructure provisioning
   - Secret management
   - Monitoring setup

2. **Deployment execution**
   - Database migrations
   - Service deployment
   - Health checks
   - Rollback plan ready

3. **Production validation**
   - Smoke tests
   - Monitor metrics
   - Check logs
   - Verify functionality

4. **Handoff**
   - Operations documentation
   - Runbook creation
   - On-call setup
   - Knowledge transfer

### Deliverables

- ✅ Production deployment successful
- ✅ Monitoring active
- ✅ Operations documentation complete
- ✅ Team trained on operations

### Exit Criteria

- [ ] Services running in production
- [ ] Health checks passing
- [ ] Monitoring dashboards active
- [ ] Alerts configured
- [ ] Team ready for on-call

### Time Investment

Typical duration: **5-10% of total project time**

## Phase Transitions

### Phase 0 → Phase 1
**Gate**: All foundational documents exist and pass validation

**Checklist**:
- [ ] Vision, Requirements, Design, Rules documents complete
- [ ] Service metadata defined
- [ ] Dependency graph generated
- [ ] `validate_context.py` passes

### Phase 1 → Phase 2
**Gate**: Requirements are refined and approved

**Checklist**:
- [ ] All requirements are specific and testable
- [ ] Priorities agreed upon
- [ ] Stakeholder sign-off obtained

### Phase 2 → Phase 3
**Gate**: Documentation is complete and reading lists are generated

**Checklist**:
- [ ] APIs fully specified
- [ ] Data models defined
- [ ] Reading lists generated for all tasks
- [ ] Technical review completed

### Phase 3 → Phase 4
**Gate**: Implementation is complete with passing tests

**Checklist**:
- [ ] All features implemented
- [ ] Tests written and passing
- [ ] Code review completed
- [ ] Documentation updated

### Phase 4 → Phase 5
**Gate**: All verification passes and stakeholders approve

**Checklist**:
- [ ] All tests pass
- [ ] No critical bugs
- [ ] Performance validated
- [ ] Security scan passes
- [ ] Stakeholder acceptance

## Iterating Within Phases

Phases are not strictly linear. It's normal to iterate:

- **Phase 2 → Phase 1**: Discover missing requirements during documentation
- **Phase 3 → Phase 2**: Realize design needs adjustment during implementation
- **Phase 4 → Phase 3**: Find bugs that require reimplementation

**Key principle**: Moving backward is fine, but always update the relevant documents before moving forward again.

## Adapting the Process

Not every project needs every phase with equal rigor:

- **Small projects**: May combine Phases 1-2
- **Prototypes**: May skip Phase 0 entirely (but can't call it Context Hive!)
- **Maintenance**: May skip directly to Phase 3 for small changes

**Core principle**: The more AI autonomy you want, the more critical Phase 0 becomes.

## Measuring Progress

Track progress through phases using:

1. **Document completion**: What percentage of docs are done?
2. **Test coverage**: What percentage of code is tested?
3. **Feature completion**: What percentage of requirements are implemented?
4. **Bug count**: How many bugs remain by severity?

**Anti-pattern**: Measuring lines of code or commits. These don't correlate with actual progress.

## Summary

The 5-phase process ensures:
- Comprehensive context exists before coding (Phase 0)
- Requirements are clear and agreed upon (Phase 1)
- Detailed documentation guides implementation (Phase 2)
- AI can implement autonomously with full context (Phase 3)
- Quality is validated thoroughly (Phase 4)
- Deployment is controlled and safe (Phase 5)

Time distribution across phases:
- Phase 0: 10-20%
- Phase 1: 5-10%
- Phase 2: 15-20%
- Phase 3: 40-50%
- Phase 4: 15-20%
- Phase 5: 5-10%

The upfront investment in documentation (Phases 0-2) pays off with faster, higher-quality implementation (Phase 3) and fewer verification issues (Phase 4).
