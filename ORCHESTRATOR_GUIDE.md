# Claude Code Orchestrator Guide for SEO Workflow

## Purpose

This guide explains how the main Claude Code agent should orchestrate the 6-step SEO website creation workflow using beads for context management.

## Workflow Execution Instructions

When the user asks to "run the SEO workflow" or "create an SEO website", follow these steps:

### 1. Verify Workflow Setup

```bash
# Check that the workflow epic exists
bd show wsagent-0yz

# List all workflow steps
bd list --parent wsagent-0yz

# Check for any blocked issues
bd blocked
```

### 2. Execute Steps Sequentially

For each step (1-6), follow this pattern:

#### Step Execution Pattern

```markdown
1. Check if step is already completed:
   bd show wsagent-0yz.<step_number>

2. If not completed, launch the agent:
   Use Task tool with subagent_type: "general-purpose"

3. Agent Prompt Template:
   "You are executing Step <N> of the SEO Website Creation Workflow.

   INSTRUCTIONS:
   1. Read your task description: bd show wsagent-0yz.<step_number>
   2. Read input data from previous steps (if needed):
      - bd show wsagent-0yz.1  (business info)
      - bd show wsagent-0yz.2  (keywords)
      - bd show wsagent-0yz.3  (SEO gaps)
      - bd show wsagent-0yz.4  (brand brief)
      - bd show wsagent-0yz.5  (website prompt)
   3. Execute your task according to the instructions
   4. Store your results: bd comment wsagent-0yz.<step_number> --body-file <results.md>
   5. Mark complete: bd close wsagent-0yz.<step_number>

   Begin execution now."

4. Wait for agent to complete
5. Verify completion: bd show wsagent-0yz.<step_number>
6. Proceed to next step
```

### 3. Specific Step Instructions

#### Step 1: Business Information Collection

```
Task Tool Invocation:
{
  "subagent_type": "general-purpose",
  "description": "Collect business information",
  "prompt": "Execute Step 1 of the SEO Website Creation Workflow.

Read instructions from: bd show wsagent-0yz.1

Your task is to collect the following information from the user:
- Business Name
- Address
- Phone Number
- Hours of Operation
- Industry
- Google My Business Profile URL (if available)
- Suggested general keywords to target
- Brand Colors (if existing)

Use the AskUserQuestion tool to collect this information interactively.

Once collected, create a markdown file with all the information and store it:
bd comment wsagent-0yz.1 --body-file business-info.md

Then close the issue:
bd close wsagent-0yz.1

Begin execution now."
}
```

#### Step 2: Local Keyword Research

```
Task Tool Invocation:
{
  "subagent_type": "general-purpose",
  "description": "Perform keyword research",
  "prompt": "Execute Step 2 of the SEO Website Creation Workflow.

Read instructions from: bd show wsagent-0yz.2
Read business information from: bd show wsagent-0yz.1

Your task is to:
1. Extract business industry, location, and suggested keywords from Step 1
2. Use WebSearch to research local keywords for this business
3. Identify target search terms relevant to the industry and location
4. Rank keywords by competition difficulty (easiest to hardest)
5. Consider local search intent and geo-modifiers

Create a comprehensive keyword research report in markdown format and store it:
bd comment wsagent-0yz.2 --body-file keyword-research.md

Then close the issue:
bd close wsagent-0yz.2

Begin execution now."
}
```

#### Step 3: SEO GAP Analysis

```
Task Tool Invocation:
{
  "subagent_type": "general-purpose",
  "description": "Perform SEO GAP analysis",
  "prompt": "Execute Step 3 of the SEO Website Creation Workflow.

Read full instructions and prompt from: bd show wsagent-0yz.3
Read business information from: bd show wsagent-0yz.1
Read keyword research from: bd show wsagent-0yz.2

Extract the variables:
- business_url (from Step 1)
- gmb_url (from Step 1)
- gmb_categories (from Step 1)
- google_keywords (from Step 2)
- sitemap_url (from Step 1 or discover it)

Use WebFetch to analyze the website and GMB profile according to the detailed instructions in wsagent-0yz.3.

Generate a comprehensive SEO GAP analysis in markdown format (NO code blocks) and store it:
bd comment wsagent-0yz.3 --body-file seo-gap-analysis.md

Then close the issue:
bd close wsagent-0yz.3

Begin execution now."
}
```

#### Step 4: Brand Brief Generation

```
Task Tool Invocation:
{
  "subagent_type": "general-purpose",
  "description": "Generate brand brief",
  "prompt": "Execute Step 4 of the SEO Website Creation Workflow.

Read full instructions and prompt from: bd show wsagent-0yz.4
Read business information from: bd show wsagent-0yz.1
Read SEO GAP analysis from: bd show wsagent-0yz.3

Extract the website URL and GMB URL from Step 1.

Use WebSearch and WebFetch to thoroughly analyze the company's website and GMB profile.

Create a comprehensive brand brief following the 9-section structure defined in wsagent-0yz.4.

Format in clean markdown with bullet points and short paragraphs.

Store the brand brief:
bd comment wsagent-0yz.4 --body-file brand-brief.md

Then close the issue:
bd close wsagent-0yz.4

Begin execution now."
}
```

#### Step 5: Website Prompt Creation

```
Task Tool Invocation:
{
  "subagent_type": "general-purpose",
  "description": "Create website prompt",
  "prompt": "Execute Step 5 of the SEO Website Creation Workflow.

Read instructions from: bd show wsagent-0yz.5
Read all previous step data:
- bd show wsagent-0yz.1 (business info)
- bd show wsagent-0yz.2 (keywords)
- bd show wsagent-0yz.3 (SEO gaps)
- bd show wsagent-0yz.4 (brand brief)

Your task is to synthesize all collected information into a comprehensive, detailed prompt for website creation.

The prompt should include:
1. Site structure based on SEO GAP analysis
2. Target keywords and SEO optimization strategy
3. Brand guidelines from the brand brief
4. Required pages and content hierarchy
5. Visual design direction using brand colors
6. Local SEO elements (GMB integration, NAP consistency, schema markup)
7. Technical SEO requirements

Create an extremely detailed, actionable website creation prompt.

Store it:
bd comment wsagent-0yz.5 --body-file website-creation-prompt.md

Then close the issue:
bd close wsagent-0yz.5

Begin execution now."
}
```

#### Step 6: Website Creation

```
Task Tool Invocation:
{
  "subagent_type": "general-purpose",
  "description": "Build SEO website",
  "prompt": "Execute Step 6 of the SEO Website Creation Workflow.

Read instructions from: bd show wsagent-0yz.6
Read the detailed website creation prompt from: bd show wsagent-0yz.5

Access all supporting data if needed:
- bd show wsagent-0yz.1-4

Your task is to build a complete, functional, SEO-optimized website based on the detailed prompt.

Create all required files in: /home/groot/projects/wsagent/client-website/

Ensure:
- Proper file structure
- All pages with SEO-optimized content
- Title tags and meta descriptions
- Internal linking structure
- Schema markup for local business
- Mobile-responsive design
- Brand visual identity implementation
- Clean URL structure
- Image optimization
- Sitemap generation

When complete, close the issue:
bd close wsagent-0yz.6

Begin execution now."
}
```

### 4. Monitor Progress

Between steps, check progress:

```bash
# View overall workflow status
bd list --parent wsagent-0yz

# Check specific step
bd show wsagent-0yz.3

# View step output
bd show wsagent-0yz.3  # Comments contain the results
```

### 5. Handle Errors

If a step fails:

```bash
# Mark as blocked
bd update wsagent-0yz.3 --status blocked

# Add error details
bd comment wsagent-0yz.3 "Error: [description]"

# Notify user and request intervention
```

### 6. Complete Workflow

After all 6 steps are closed:

```bash
# Close the epic
bd close wsagent-0yz

# Generate summary
bd show wsagent-0yz
bd list --parent wsagent-0yz
```

## Key Principles

1. **Sequential Execution:** Complete each step before moving to the next
2. **Data via Beads:** Agents read from previous issues using `bd show`
3. **Results Storage:** Agents store results using `bd comment --body-file`
4. **Completion Signal:** Agents close their issue with `bd close`
5. **Context Efficiency:** Only load data as needed, reducing token usage
6. **Resumable:** Can check status and resume from any incomplete step

## Error Recovery

If the workflow is interrupted:

```bash
# Find last completed step
bd list --parent wsagent-0yz --status closed

# Resume from next unclosed step
# The orchestrator automatically skips completed steps
```

## Best Practices

1. **Verify Before Launch:** Always check issue status before launching agent
2. **Wait for Completion:** Don't proceed to next step until current step is closed
3. **Validate Results:** Check that agent stored results in issue comments
4. **Error Logging:** Log all errors to issue comments for debugging
5. **User Updates:** Inform user of progress after each step

## Example Full Orchestration

```markdown
User: "Run the SEO website workflow"

Orchestrator:
1. ✓ Verify workflow exists: bd show wsagent-0yz
2. ✓ Check all steps: bd list --parent wsagent-0yz
3. → Launch Step 1 agent (Business Info Collection)
4. ⏳ Wait for completion
5. ✓ Verify: bd show wsagent-0yz.1
6. → Launch Step 2 agent (Keyword Research)
7. ⏳ Wait for completion
8. ✓ Verify: bd show wsagent-0yz.2
9. → Launch Step 3 agent (SEO GAP Analysis)
10. ⏳ Wait for completion
11. ✓ Verify: bd show wsagent-0yz.3
12. → Launch Step 4 agent (Brand Brief)
13. ⏳ Wait for completion
14. ✓ Verify: bd show wsagent-0yz.4
15. → Launch Step 5 agent (Website Prompt)
16. ⏳ Wait for completion
17. ✓ Verify: bd show wsagent-0yz.5
18. → Launch Step 6 agent (Website Creation)
19. ⏳ Wait for completion
20. ✓ Verify: bd show wsagent-0yz.6
21. ✓ Close epic: bd close wsagent-0yz
22. ✓ Report completion to user
```

## Technical Notes

- All `bd` commands are executed via the Bash tool
- Agent launching uses the Task tool with subagent_type: "general-purpose"
- File paths for results should use /home/groot/projects/wsagent/ as the base
- Markdown files should be created using the Write tool before adding to beads
- WebSearch and WebFetch capabilities are available to agents as needed
