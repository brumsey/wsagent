# SEO Website Creation Workflow System

An intelligent, multi-agent workflow system for creating SEO-optimized websites for local businesses using Claude Code and beads issue tracking.

## Overview

This workflow orchestrates 6 specialized agents that work in sequence to research, analyze, and build a complete SEO-optimized website. By using beads for context management, the system efficiently passes data between agents while minimizing token usage.

## Features

- **Multi-Agent Architecture:** 6 specialized agents, each focused on a specific task
- **Efficient Context Management:** Uses beads issues to store and retrieve data between steps
- **Resumable Workflow:** Can stop and resume at any point
- **Full Audit Trail:** Complete history preserved in beads database
- **Modular Design:** Easy to modify individual steps
- **Token Efficient:** Only loads required data when needed

## Workflow Steps

1. **Business Information Collection** → Gather essential business details
2. **Local Keyword Research** → Identify and rank target keywords
3. **SEO GAP Analysis** → Analyze website and GMB for optimization gaps
4. **Brand Brief Generation** → Create comprehensive brand guidelines
5. **Website Prompt Creation** → Synthesize everything into detailed website spec
6. **Website Creation** → Build the complete SEO-optimized website

## Quick Start

### 1. Verify Workflow Setup

```bash
# Check workflow epic
bd show wsagent-0yz

# List all steps
bd list --parent wsagent-0yz
```

### 2. Run the Workflow

In Claude Code, ask:
```
"Run the SEO website workflow"
```

The main orchestrator will:
- Launch each agent in sequence
- Pass context via beads issues
- Monitor progress
- Handle errors
- Generate the final website

### 3. Monitor Progress

```bash
# Check overall status
bd stats

# View workflow steps
bd list --parent wsagent-0yz

# View specific step details
bd show wsagent-0yz.1

# Check for blocked issues
bd blocked
```

## Architecture

```
wsagent-0yz (Epic)
├── wsagent-0yz.1 - Business Information Collection
├── wsagent-0yz.2 - Local Keyword Research
├── wsagent-0yz.3 - SEO GAP Analysis
├── wsagent-0yz.4 - Brand Brief Generation
├── wsagent-0yz.5 - Website Prompt Creation
└── wsagent-0yz.6 - SEO-Optimized Website Creation
```

Each step:
- Reads its task from its beads issue
- Reads input data from previous steps
- Executes its specialized task
- Stores results in its issue
- Closes the issue when complete

## Data Flow

```
Step 1 → Business Info
         ↓
Step 2 → Keyword Research
         ↓
Step 3 → SEO GAP Analysis
         ↓
Step 4 → Brand Brief
         ↓
Step 5 → Website Prompt
         ↓
Step 6 → Website Files
```

## Documentation

- **`seo-workflow-orchestrator.md`** - Detailed architecture and orchestration patterns
- **`ORCHESTRATOR_GUIDE.md`** - Step-by-step guide for Claude Code orchestration
- **`run-seo-workflow.sh`** - Interactive workflow runner script
- **`AGENTS.md`** - Individual agent specifications (if created)

## Beads Integration

### Why Beads?

Traditional agent workflows pass context through prompts, which:
- Consumes excessive tokens
- Hits context limits quickly
- Makes resumption difficult
- Provides no audit trail

Beads solves this by:
- Storing data in structured issues
- Agents read only what they need
- Full history preserved
- Easy resumption from any point
- Clear dependency management

### Beads Commands Used

```bash
# View issue and its data
bd show <issue-id>

# Add results to issue
bd comment <issue-id> --body-file <results.md>

# Update issue status
bd update <issue-id> --status in-progress

# Mark issue complete
bd close <issue-id>

# List workflow issues
bd list --parent wsagent-0yz

# Check blocked issues
bd blocked
```

## Agent Specifications

### Step 1: Business Information Collection
- **Type:** general-purpose agent
- **Input:** User interaction
- **Output:** Structured business data
- **Tools:** AskUserQuestion

### Step 2: Local Keyword Research
- **Type:** general-purpose agent
- **Input:** Business info from Step 1
- **Output:** Ranked keyword list
- **Tools:** WebSearch

### Step 3: SEO GAP Analysis
- **Type:** general-purpose agent
- **Input:** Business info, keywords, GMB URL
- **Output:** Comprehensive GAP analysis
- **Tools:** WebFetch
- **Prompt:** Custom (provided by user)

### Step 4: Brand Brief Generation
- **Type:** general-purpose agent
- **Input:** Business info, website URL, GMB URL
- **Output:** Complete brand brief
- **Tools:** WebSearch, WebFetch
- **Prompt:** Custom (provided by user)

### Step 5: Website Prompt Creation
- **Type:** general-purpose agent
- **Input:** All data from Steps 1-4
- **Output:** Detailed website creation prompt
- **Tools:** None (synthesis task)

### Step 6: Website Creation
- **Type:** general-purpose agent
- **Input:** Website creation prompt
- **Output:** Complete website files
- **Tools:** Write, Edit

## Output

The workflow generates:

1. **Structured Data in Beads Issues:**
   - `wsagent-0yz.1` - Business information
   - `wsagent-0yz.2` - Keyword research
   - `wsagent-0yz.3` - SEO GAP analysis
   - `wsagent-0yz.4` - Brand brief
   - `wsagent-0yz.5` - Website prompt

2. **Website Files:**
   - Location: `/home/groot/projects/wsagent/client-website/`
   - Complete HTML/CSS/JS files
   - SEO-optimized content
   - Mobile-responsive design
   - Schema markup
   - Sitemap

## Error Handling

If a step fails:

```bash
# Check for errors
bd show wsagent-0yz.3

# View blocked issues
bd blocked

# Resume from failed step
# Simply re-run the workflow - completed steps are skipped
```

## Customization

### Modifying Agent Prompts

Edit the issue description:
```bash
bd update wsagent-0yz.3 --description "New prompt here..."
```

### Adding New Steps

```bash
# Create new agent issue
bd create --title "Step 7: New Task" \
  --type agent \
  --parent wsagent-0yz \
  --priority P1 \
  --deps "blocks:wsagent-0yz.6"
```

### Changing Dependencies

```bash
# Add dependency
bd update wsagent-0yz.3 --deps "blocks:wsagent-0yz.2"
```

## Best Practices

1. **Always check issue status** before launching agents
2. **Verify results** are stored in issues after each step
3. **Monitor progress** using `bd list --parent wsagent-0yz`
4. **Log errors** in issue comments for debugging
5. **Keep prompts updated** in issue descriptions

## Troubleshooting

### Workflow won't start
```bash
bd show wsagent-0yz  # Verify epic exists
bd list --parent wsagent-0yz  # Check all steps exist
```

### Agent skipped data collection
```bash
bd show wsagent-0yz.1  # Verify data was stored
```

### Step marked complete but no results
```bash
bd show wsagent-0yz.3  # Check comments for results
bd update wsagent-0yz.3 --status open  # Reopen if needed
```

## Contributing

To modify the workflow:

1. Update issue descriptions for prompt changes
2. Add new issues for new steps
3. Update dependencies as needed
4. Document changes in this README

## License

This workflow system is designed for use with Claude Code and beads.

## Support

For issues or questions:
- Check beads documentation: `bd --help`
- Review orchestrator guide: `ORCHESTRATOR_GUIDE.md`
- Check workflow architecture: `seo-workflow-orchestrator.md`

## Version

- **Workflow Version:** 1.0
- **Created:** 2025-12-31
- **Workflow Epic:** wsagent-0yz
- **Issue Prefix:** wsagent
- **Total Steps:** 6