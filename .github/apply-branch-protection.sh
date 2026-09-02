#!/bin/bash
# 用法: GITHUB_TOKEN=xxx .github/apply-branch-protection.sh
# 需要 GitHub token：https://github.com/settings/tokens

set -e

OWNER="coolyard"
REPO="CBTI"
API="https://api.github.com/repos/${OWNER}/${REPO}/branches"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN not set"
  exit 1
fi

for BRANCH in main; do
  echo "Setting protection for branch: $BRANCH"

  curl -s -X PUT "${API}/${BRANCH}/protection" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Content-Type: application/json" \
    -d '{
      "required_status_checks": {
        "strict": true,
        "contexts": ["quality"]
      },
      "enforce_admins": false,
      "required_pull_request_reviews": {
        "dismiss_stale_reviews": true,
        "require_code_owner_reviews": false,
        "required_approving_review_count": 1
      },
      "restrictions": null,
      "required_linear_history": false,
      "allow_force_pushes": false,
      "allow_deletions": false,
      "block_creations": false,
      "required_conversation_resolution": false
    }' | python3 -c "import sys,json; d=json.load(sys.stdin); print('  OK' if 'url' in d else f'  Error: {d.get(\"message\", d)}')"

  echo ""
done

echo "Done. Verify at: https://github.com/${OWNER}/${REPO}/settings/branches"
