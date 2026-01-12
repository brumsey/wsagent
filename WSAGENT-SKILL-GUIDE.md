# WSAgent Claude Skill - Installation & Usage Guide

## What Was Created

A new Claude Code skill called `/wsagent` that orchestrates the complete SEO Website Creation Workflow using the same patterns as the `/n8n-project` skill.

**Location:** `~/.claude/skills/wsagent/SKILL.md`

## Installation

The skill is already installed and ready to use! Claude Code automatically detects skills in the `~/.claude/skills/` directory.

## How to Use

### Basic Invocation

Simply type in Claude Code:

```
/wsagent
```

Or with a client name:

```
/wsagent plumb-simple
```

### What It Does

The `/wsagent` skill orchestrates the complete 6-step SEO Website Creation Workflow:

1. **Business Information Collection** - Gathers client details via interactive questions
2. **Local Keyword Research** - Uses WebSearch to find and rank target keywords
3. **SEO GAP Analysis** - Uses WebFetch to analyze current site and GMB profile
4. **Brand Brief Generation** - Creates comprehensive brand guidelines
5. **Website Prompt Creation** - Synthesizes all research into detailed website spec
6. **Website Creation** - Builds the complete SEO-optimized website

### Key Features

✅ **Multi-Session Support** - Uses Beads to track workflow across sessions
✅ **Resume Capability** - Automatically detects completed steps and resumes from where you left off
✅ **Token Efficient** - Uses Serena for efficient file operations
✅ **Data Preservation** - All research stored in Beads issues for easy retrieval
✅ **Git Integration** - Commits after each major step
✅ **Error Handling** - Gracefully handles failures and allows retry

## Workflow Structure

The skill uses Beads epic `wsagent-0yz` with 6 child issues:

```
wsagent-0yz (Epic)
├── wsagent-0yz.1 - Business Information Collection
├── wsagent-0yz.2 - Local Keyword Research
├── wsagent-0yz.3 - SEO GAP Analysis
├── wsagent-0yz.4 - Brand Brief Generation
├── wsagent-0yz.5 - Website Prompt Creation
└── wsagent-0yz.6 - SEO-Optimized Website Creation
```

Each step depends on the previous one, creating a clean dependency chain.

## Example Usage Scenarios

### Scenario 1: Start New Client Project

```
You: /wsagent acme-plumbing

Agent will:
1. Check if workflow exists
2. If not, create epic and 6 issues
3. Start with Step 1: Business Information Collection
4. Ask you interactive questions
5. Store results in beads
6. Proceed through all 6 steps sequentially
7. Generate complete website in client-website/
```

### Scenario 2: Resume Interrupted Workflow

```
You: /wsagent

Agent will:
1. Check existing workflow
2. Identify completed steps
3. Find first open/in-progress issue
4. Resume from that step
5. Complete remaining steps
```

### Scenario 3: Run Single Step

```
You: /wsagent --step 2

Agent will:
1. Check dependencies (step 1 must be complete)
2. Execute only step 2 (Keyword Research)
3. Store results and close issue
4. Report completion
```

## Data Storage

### Beads Issues
- **Business Info:** Stored in `wsagent-0yz.1` comments
- **Keywords:** Stored in `wsagent-0yz.2` comments
- **SEO GAP:** Stored in `wsagent-0yz.3` comments
- **Brand Brief:** Stored in `wsagent-0yz.4` comments
- **Website Prompt:** Stored in `wsagent-0yz.5` comments

### File System
- **Website Output:** `/home/groot/projects/wsagent/client-website/`
- **Research Files:** `business-info.md`, `keyword-research.md`, etc.

### Git Repository
- **All changes committed** after each step
- **Beads database** synced to `.beads/issues.jsonl`
- **Tagged releases** for completed projects

## Monitoring Progress

```bash
# View overall workflow status
bd show wsagent-0yz

# List all steps with status
bd list --parent wsagent-0yz

# View specific step details and results
bd show wsagent-0yz.3

# Check for active work
bd list --status in_progress

# Check for blocked issues
bd blocked

# View project statistics
bd stats
```

## Comparison with n8n-project Skill

| Feature | n8n-project | wsagent |
|---------|-------------|---------|
| **Purpose** | Build n8n nodes/workflows | Create SEO websites |
| **Steps** | 7 (flexible) | 6 (sequential) |
| **MCP Tools** | n8n MCP server | Web research tools |
| **Documentation** | Context7 for n8n | WebSearch/WebFetch |
| **Output** | Node code, workflows | Complete website |
| **Beads** | ✅ Task tracking | ✅ Task tracking |
| **Serena** | ✅ Code operations | ✅ File operations |
| **Git** | ✅ Version control | ✅ Version control |
| **Multi-session** | ✅ Yes | ✅ Yes |

## Advantages of the Skill Pattern

### Without Skill (Manual)
```
You: "Run the SEO workflow"
Agent: Reads entire ORCHESTRATOR_GUIDE.md (10KB+ in context)
Agent: Launches first agent with full prompt
Agent: You must manually tell it to continue after each step
Token usage: HIGH
Error rate: HIGHER (manual step tracking)
```

### With /wsagent Skill
```
You: "/wsagent"
Agent: Loads skill instructions (efficient)
Agent: Automatically checks beads for state
Agent: Sequentially executes all steps
Agent: Stores results in beads
Agent: Auto-resumes if interrupted
Token usage: LOWER (beads stores data, not in prompt)
Error rate: LOWER (automated flow)
```

## Customization

### Modify Step Prompts

Edit the skill file:
```bash
nano ~/.claude/skills/wsagent/SKILL.md
```

Find the step you want to modify (search for "Step X: ") and update the agent prompt.

### Add New Steps

1. Edit SKILL.md to add new step instructions
2. Create new beads issue: `bd create "Step 7: New Task" --parent wsagent-0yz`
3. Set dependency: `bd dep add wsagent-0yz.7 wsagent-0yz.6`
4. The skill will automatically include it in the workflow

### Change Workflow Order

Modify dependencies in beads:
```bash
bd dep remove wsagent-0yz.3 wsagent-0yz.2
bd dep add wsagent-0yz.3 wsagent-0yz.1
```

## Troubleshooting

### Skill not found
```bash
# Verify skill file exists
ls -la ~/.claude/skills/wsagent/SKILL.md

# Check permissions
chmod 644 ~/.claude/skills/wsagent/SKILL.md

# Restart Claude Code session
```

### Workflow won't start
```bash
# Check if epic exists
bd show wsagent-0yz

# If not, create it manually
bd epic create "SEO Website Creation Workflow"

# Or let the skill create it on first run
```

### Step stuck in-progress
```bash
# View step details
bd show wsagent-0yz.3

# Check comments for errors
bd comments wsagent-0yz.3 list

# Manually close if needed
bd close wsagent-0yz.3

# Or reopen to retry
bd update wsagent-0yz.3 --status open
```

### Missing data from previous step
```bash
# Verify data was stored
bd show wsagent-0yz.2

# Look for comments with --body-file
bd comments wsagent-0yz.2 list

# If missing, reopen and re-run step
bd update wsagent-0yz.2 --status open
```

## Session Closing Protocol

The skill includes automatic reminders to:

1. ✅ Check pending work: `bd list --status in_progress`
2. ✅ Commit changes: `git add . && git commit`
3. ✅ Sync beads: `bd sync`
4. ✅ Push to remote: `git push`
5. ✅ Verify push: `git status` (must show "up to date")

**NEVER end a session without pushing!**

## Next Steps

1. **Test the skill:**
   ```
   /wsagent test-client
   ```

2. **Create a real project:**
   ```
   /wsagent <actual-client-name>
   ```

3. **Monitor progress:**
   ```bash
   bd list --parent wsagent-0yz
   ```

4. **Review generated website:**
   ```bash
   ls -la /home/groot/projects/wsagent/client-website/
   ```

5. **Deploy website:**
   - Copy files to hosting provider
   - Configure domain
   - Set up analytics
   - Submit to Google Search Console

## Benefits

✅ **Consistency** - Every project follows the same proven workflow
✅ **Resumability** - Never lose progress, even across days/weeks
✅ **Audit Trail** - Complete history in beads and git
✅ **Token Efficiency** - Data stored in beads, not in prompts
✅ **Quality** - Comprehensive research drives better websites
✅ **Speed** - Automated orchestration saves time
✅ **Collaboration** - Beads makes it easy to hand off between sessions

## Support

- **Skill documentation:** `~/.claude/skills/wsagent/SKILL.md`
- **Project README:** `/home/groot/projects/wsagent/README.md`
- **Orchestrator guide:** `/home/groot/projects/wsagent/ORCHESTRATOR_GUIDE.md`
- **Beads help:** `bd --help`
- **Claude Code docs:** `claude --help`

---

**Created:** 2026-01-11
**Version:** 1.0.0
**Skill Name:** wsagent
**Based On:** n8n-project skill pattern
