// eslint-disable-next-line import/no-unresolved
import {PullRequest} from '@octokit/webhooks-types'
import {useOctokit} from '../helpers/use-octokit'
import * as core from '@actions/core'
import {setInput} from '../helpers/input-helpers'
import {getPullRequestIssuesActionWorker} from '../get-pr-issues/get-pull-request-issues-action-worker'
import {context} from '@actions/github'
export async function addCommentToPullAndIssues(
  pullRequest: PullRequest,
  commentStr: string
): Promise<void> {
  await useOctokit(async octokit => {
    const addTo = core.getInput('addTo', {required: true}).toLowerCase()
    let issueNumbers: number[] = []
    if (addTo === 'pull' || addTo === 'pullandissues') {
      issueNumbers.push(pullRequest.number)
    }
    if (addTo === 'issues' || addTo === 'pullandissues') {
      setInput('pullRequest', JSON.stringify({pull_request: pullRequest}))
      issueNumbers = issueNumbers.concat(
        await getPullRequestIssuesActionWorker()
      )
    }
    const commentIds: number[] = []
    for (const issueNumber of issueNumbers) {
      const {data: comment} = await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: issueNumber,
        body: commentStr
      })
      commentIds.push(comment.id)
      // eslint-disable-next-line i18n-text/no-en
      core.info(`Created comment id '${comment.id}' on issue '${issueNumber}'.`)
    }
    core.setOutput('commentIds', commentIds)
  })
}
