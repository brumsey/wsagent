#!/bin/bash
# SEO Website Creation Workflow Runner
# This script orchestrates the 6-step workflow using Claude Code agents and beads

set -e  # Exit on error

WORKFLOW_EPIC="wsagent-0yz"
WORKFLOW_NAME="SEO Website Creation Workflow"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  $WORKFLOW_NAME${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if issue is completed
check_issue_status() {
    local issue_id=$1
    bd show "$issue_id" --json | grep -q '"status":"closed"'
}

# Function to run a workflow step
run_step() {
    local step_num=$1
    local step_name=$2
    local issue_id="${WORKFLOW_EPIC}.${step_num}"

    echo -e "${YELLOW}Step $step_num: $step_name${NC}"
    echo -e "Issue ID: $issue_id"

    # Check if already completed
    if check_issue_status "$issue_id" 2>/dev/null; then
        echo -e "${GREEN}✓ Already completed, skipping${NC}"
        echo ""
        return 0
    fi

    echo -e "Status: ${BLUE}Starting...${NC}"
    echo ""

    # Show issue details
    bd show "$issue_id"
    echo ""

    echo -e "${YELLOW}Ready to launch agent for this step.${NC}"
    echo -e "The agent will:"
    echo -e "  1. Read the issue description for instructions"
    echo -e "  2. Read data from previous steps if needed"
    echo -e "  3. Execute its task"
    echo -e "  4. Store results in the issue"
    echo -e "  5. Close the issue when complete"
    echo ""
    echo -e "${YELLOW}Press Enter to continue or Ctrl+C to abort...${NC}"
    read -r

    # Note: The actual agent launching should be done through Claude Code
    # This script serves as a guide for the orchestration flow
    echo -e "${RED}[Manual Step Required]${NC}"
    echo -e "Launch the agent for this step in Claude Code using:"
    echo -e "  ${BLUE}/task Execute step $step_num: Read issue $issue_id and complete the task${NC}"
    echo ""
    echo -e "Press Enter when the agent has completed this step..."
    read -r

    # Verify completion
    if check_issue_status "$issue_id" 2>/dev/null; then
        echo -e "${GREEN}✓ Step $step_num completed${NC}"
    else
        echo -e "${YELLOW}⚠ Step $step_num not marked as closed. Continuing anyway...${NC}"
    fi

    echo ""
    echo -e "${BLUE}----------------------------------------${NC}"
    echo ""
}

# Check if workflow epic exists
if ! bd show "$WORKFLOW_EPIC" &>/dev/null; then
    echo -e "${RED}Error: Workflow epic $WORKFLOW_EPIC not found${NC}"
    echo "Please initialize the workflow first."
    exit 1
fi

echo -e "${GREEN}Workflow epic found: $WORKFLOW_EPIC${NC}"
echo ""

# Show workflow overview
echo -e "${BLUE}Workflow Overview:${NC}"
bd list --parent "$WORKFLOW_EPIC"
echo ""

echo -e "${YELLOW}Starting workflow execution...${NC}"
echo ""
sleep 2

# Execute each step in sequence
run_step "1" "Business Information Collection"
run_step "2" "Local Keyword Research"
run_step "3" "SEO GAP Analysis"
run_step "4" "Brand Brief Generation"
run_step "5" "Website Prompt Creation"
run_step "6" "SEO-Optimized Website Creation"

# Complete the workflow
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Workflow Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${BLUE}Closing workflow epic...${NC}"
bd close "$WORKFLOW_EPIC"

echo -e "${GREEN}✓ All steps completed successfully${NC}"
echo ""

echo -e "${BLUE}Final Status:${NC}"
bd show "$WORKFLOW_EPIC"
echo ""

echo -e "${GREEN}The SEO-optimized website has been created!${NC}"
echo -e "Check the client-website directory for the generated files."
