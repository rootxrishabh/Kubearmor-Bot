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
}

// 


//new ideas

// 1) use /assign to auto assign on an issue (check for 14 days of inactivity and assignment)

// 2) use /{label-name} to assign a label

// 3) Close a PR/issue after 90 days of inactivity


// logic for implementing the PR labeling

  // app.on("pull_request.reopened", async(context) => {
  //   return context.octokit.issues.addLabels(context.issue({
  //     labels: ["stale"]
  //   }))
  // })