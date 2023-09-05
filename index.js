const { Context } = require('probot');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
// Greet a user when an issue is opened
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });

// Assign reviewers to a PR using a list
  app.on("pull_request.opened", async (context) => {
    return context.octokit.pulls.requestReviewers(context.pullRequest({reviewers: ["rootxrishabh"]}))
  })


  // labeling all PRs stale after 45 days of inactivity
  app.on("pull_request.reopened", async(context) => {
    const pullRequests = await context.octokit.pulls.list(context.repo())
    const currentDate = new Date()
    pullRequests.data.forEach(pullRequest => {
      const prDate = new Date(pullRequest.updated_at)
      if (((currentDate - prDate)/(1000 * 60 * 60 * 24)) > 0){
              context.octokit.issues.addLabels(context.issue({
                labels: ["stale"]
              }))
        }
    })
  })


// checking weather all tests are passing or not, if not then create a message to address these failing tests after 15min of failing

app.on("pull_request.reopened", async(context) => {
  await new Promise((resolve) => setTimeout(resolve, 900000));
    const owner = context.pullRequest()

    const pr = await context.octokit.pulls.get(owner);

    const latestCommitSHA = pr.data.head.sha;

    const checkRuns = await context.octokit.checks.listForRef({
      owner: owner.owner,
      repo: owner.repo,
      ref: latestCommitSHA,
    });

    const failingChecks = checkRuns.data.check_runs.filter(
      (check) => check.conclusion === "failure"
    );

    if (failingChecks.length > 0) {
      const issueComment = context.issue({
        body: "You have some failing checks!",
      });
      return context.octokit.issues.createComment(issueComment);
    }
})
}