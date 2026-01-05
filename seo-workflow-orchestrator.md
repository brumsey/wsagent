# SEO Website Creation Workflow Orchestrator

## Overview

This orchestrator manages a 6-step workflow for creating SEO-optimized websites for local businesses. Each step is handled by a specialized agent that reads from and writes to beads issues, enabling efficient context passing without bloating token usage.

## Workflow Architecture

```
Main Orchestrator (Claude Code Main Agent)
    │
    ├─> Step 1: Business Information Collection Agent
    │       └─> Updates wsagent-0yz.1 with collected data
    │
    ├─> Step 2: Local Keyword Research Agent
    │       └─> Reads wsagent-0yz.1, updates wsagent-0yz.2
    │
    ├─> Step 3: SEO GAP Analysis Agent
    │       └─> Reads wsagent-0yz.1, wsagent-0yz.2, updates wsagent-0yz.3
    │
    ├─> Step 4: Brand Brief Generation Agent
    │       └─> Reads wsagent-0yz.1, wsagent-0yz.3, updates wsagent-0yz.4
    │
    ├─> Step 5: Website Prompt Creation Agent
    │       └─> Reads wsagent-0yz.1-4, updates wsagent-0yz.5
    │
    └─> Step 6: Website Creation Agent
            └─> Reads wsagent-0yz.5, creates website files
```

## Beads Issue Structure

**Epic Issue:** `wsagent-0yz` - SEO Website Creation Workflow System
- **Type:** epic
- **Purpose:** Parent container for all workflow steps

**Child Issues:**
1. `wsagent-0yz.1` - Business Information Collection
2. `wsagent-0yz.2` - Local Keyword Research (blocks: wsagent-0yz.1)
3. `wsagent-0yz.3` - SEO GAP Analysis (blocks: wsagent-0yz.2)
4. `wsagent-0yz.4` - Brand Brief Generation (blocks: wsagent-0yz.3)
5. `wsagent-0yz.5` - Website Prompt Creation (blocks: wsagent-0yz.4)
6. `wsagent-0yz.6` - SEO-Optimized Website Creation (blocks: wsagent-0yz.5)

## Orchestration Pattern

### Main Orchestrator Responsibilities

1. **Initialize Workflow**
   - Verify all beads issues exist
   - Check dependency chain
   - Start with Step 1

2. **Agent Execution Loop**
   ```
   For each step (1-6):
     a. Launch specialized agent using Task tool
     b. Agent reads input from previous step's beads issue
     c. Agent performs its task
     d. Agent updates its own beads issue with results
     e. Agent marks its issue as completed
     f. Orchestrator verifies completion
     g. Move to next step
   ```

3. **Error Handling**
   - If agent fails, mark issue as blocked
   - Log error details in issue comments
   - Notify user for intervention

4. **Completion**
   - Verify all 6 steps marked as completed
   - Close epic issue wsagent-0yz
   - Generate summary report

### Agent Pattern (for each step)

Each agent follows this pattern:

```markdown
## Agent Initialization
1. Read issue description to understand task
2. Identify input dependencies (previous step issues)
3. Read required data from previous issues using `bd show <issue-id>`

## Execution
1. Perform assigned task (collect info, research, analyze, etc.)
2. Generate output according to specifications

## Data Storage
1. Add comment to own issue with results: `bd comment <issue-id> --body-file results.md`
2. Update issue status to in-progress: `bd update <issue-id> --status in-progress`

## Completion
1. Mark issue as completed: `bd close <issue-id>`
2. Signal orchestrator that next step can begin
```

## Data Flow Between Agents

### Step 1 → Step 2
- Business industry, location, GMB URL, suggested keywords

### Step 2 → Step 3
- Ranked keyword list with competition analysis

### Step 3 → Step 4
- SEO GAP analysis results (markdown)

### Step 4 → Step 5
- Complete brand brief (markdown)

### Step 5 → Step 6
- Detailed website creation prompt

### Step 6 → Output
- Complete website files in project directory

## Usage Instructions

### Starting the Workflow

```bash
# The orchestrator will execute this command sequence:
bd show wsagent-0yz.1  # Verify Step 1 is ready
# Launch Step 1 agent
# Wait for completion
# Repeat for steps 2-6
```

### Monitoring Progress

```bash
# Check overall workflow status
bd show wsagent-0yz

# Check individual step status
bd list --parent wsagent-0yz

# View step details
bd show wsagent-0yz.1  # or any step number

# Check for blocked issues
bd blocked
```

### Resuming After Interruption

```bash
# Find last completed step
bd list --parent wsagent-0yz --status closed

# Resume from next step
# Orchestrator will automatically skip completed steps
```

## Agent Task Tool Invocations

### Step 1: Business Information Collection
```
Task tool:
- subagent_type: "general-purpose"
- prompt: "Read issue wsagent-0yz.1 for instructions. Collect business information by asking the user for: Business Name, Address, Phone, Hours, Industry, GMB URL, Keywords, Brand Colors. Store all information in wsagent-0yz.1 using bd comment, then close the issue."
```

### Step 2: Local Keyword Research
```
Task tool:
- subagent_type: "general-purpose"
- prompt: "Read wsagent-0yz.2 for instructions and wsagent-0yz.1 for business data. Perform local keyword research using WebSearch. Rank keywords by difficulty. Store results in wsagent-0yz.2 using bd comment, then close the issue."
```

### Step 3: SEO GAP Analysis
```
Task tool:
- subagent_type: "general-purpose"
- prompt: "Read wsagent-0yz.3 for full instructions. Use data from wsagent-0yz.1 and wsagent-0yz.2. Analyze website and GMB profile using WebFetch. Generate GAP analysis in markdown. Store in wsagent-0yz.3 using bd comment, then close."
```

### Step 4: Brand Brief Generation
```
Task tool:
- subagent_type: "general-purpose"
- prompt: "Read wsagent-0yz.4 for full prompt. Use data from wsagent-0yz.1 and wsagent-0yz.3. Research website and GMB using WebSearch/WebFetch. Create comprehensive brand brief. Store in wsagent-0yz.4 using bd comment, then close."
```

### Step 5: Website Prompt Creation
```
Task tool:
- subagent_type: "general-purpose"
- prompt: "Read wsagent-0yz.5 for instructions. Synthesize data from wsagent-0yz.1-4. Create detailed website creation prompt including SEO strategy, site structure, brand guidelines, and technical requirements. Store in wsagent-0yz.5 using bd comment, then close."
```

### Step 6: Website Creation
```
Task tool:
- subagent_type: "general-purpose"
- prompt: "Read wsagent-0yz.6 for instructions and wsagent-0yz.5 for the detailed prompt. Build complete SEO-optimized website with all pages, proper structure, and brand implementation. Create files in /home/groot/projects/wsagent/client-website/. Close wsagent-0yz.6 when complete."
```

## Benefits of This Architecture

1. **Reduced Context Length:** Each agent only loads the specific data it needs from beads issues
2. **Resumable:** Can stop and resume at any step
3. **Auditable:** Full workflow history preserved in beads
4. **Modular:** Easy to modify individual steps without affecting others
5. **Scalable:** Can add new steps or parallel branches easily
6. **Memory Efficient:** Data stored in beads rather than passed in prompts

## Example Orchestrator Execution

```markdown
User: "Start the SEO website workflow"

Orchestrator:
1. Checks beads issues exist ✓
2. Launches Step 1 agent → Collects business info → Updates wsagent-0yz.1 ✓
3. Launches Step 2 agent → Reads wsagent-0yz.1 → Researches keywords → Updates wsagent-0yz.2 ✓
4. Launches Step 3 agent → Reads wsagent-0yz.1, wsagent-0yz.2 → Analyzes SEO gaps → Updates wsagent-0yz.3 ✓
5. Launches Step 4 agent → Reads wsagent-0yz.1, wsagent-0yz.3 → Creates brand brief → Updates wsagent-0yz.4 ✓
6. Launches Step 5 agent → Reads wsagent-0yz.1-4 → Creates website prompt → Updates wsagent-0yz.5 ✓
7. Launches Step 6 agent → Reads wsagent-0yz.5 → Builds website → Creates files ✓
8. Closes epic wsagent-0yz ✓
9. Reports completion to user ✓
```

## Notes

- All agents should use `bd show <issue-id>` to read data
- All agents should use `bd comment <issue-id> --body-file <file>` to store results
- All agents should use `bd close <issue-id>` when their task is complete
- The orchestrator should verify each step's completion before proceeding
- Failed steps should be marked as blocked with error details in comments
