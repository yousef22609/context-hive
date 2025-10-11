#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
set -eu

# Usage: ./scripts/release_notes.sh [from_tag] [to_tag]
# If no tags provided, generates notes from last tag to HEAD

FROM_TAG=${1:-$(git describe --tags --abbrev=0 2>/dev/null || echo "")}
TO_TAG=${2:-HEAD}

if [ -z "$FROM_TAG" ]; then
    echo "No previous tag found. Showing all commits:"
    RANGE="HEAD"
else
    RANGE="$FROM_TAG..$TO_TAG"
    echo "Generating release notes from $FROM_TAG to $TO_TAG"
fi

echo ""
echo "=========================================="
echo "Release Notes"
echo "=========================================="
echo ""

# Extract commits by type using Conventional Commits
declare -A commit_types=(
    ["feat"]="## Features"
    ["fix"]="## Bug Fixes"
    ["docs"]="## Documentation"
    ["refactor"]="## Refactoring"
    ["test"]="## Tests"
    ["chore"]="## Chores"
    ["perf"]="## Performance"
)

# Collect commits by type
for type in "${!commit_types[@]}"; do
    commits=$(git log $RANGE --pretty=format:"- %s (%h)" --grep="^$type:" 2>/dev/null || true)
    if [ -n "$commits" ]; then
        echo "${commit_types[$type]}"
        echo "$commits" | sed 's/^'$type'://' | sed 's/^: //'
        echo ""
    fi
done

# Show breaking changes
breaking=$(git log $RANGE --pretty=format:"- %s (%h)" --grep="BREAKING CHANGE" 2>/dev/null || true)
if [ -n "$breaking" ]; then
    echo "## ⚠️  BREAKING CHANGES"
    echo "$breaking"
    echo ""
fi

# Show other commits
other=$(git log $RANGE --pretty=format:"- %s (%h)" --invert-grep --grep="^feat:" --grep="^fix:" --grep="^docs:" --grep="^refactor:" --grep="^test:" --grep="^chore:" --grep="^perf:" --grep="BREAKING CHANGE" 2>/dev/null || true)
if [ -n "$other" ]; then
    echo "## Other Changes"
    echo "$other"
    echo ""
fi

echo "=========================================="
echo ""
echo "Contributors:"
git log $RANGE --pretty=format:"- %an <%ae>" 2>/dev/null | sort -u || true
echo ""
