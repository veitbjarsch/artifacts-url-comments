import {getWorkflowArtifactsComment} from './get-workflow-artifacts-comment'
import {workflowGetPullRequest} from '../get-pull-request'
import {trySetFailedAsync} from '../../helpers/try-catch-set-failed'
import {getBoolInput} from '../../helpers/input-helpers'
import {addCommentToPullAndIssues} from '../../comments/add-comment-to-pull-and-issues'

export async function workflowArtifactsPullRequestCommentAction(): Promise<void> {
  return trySetFailedAsync(async () => {
    const pullRequest = await workflowGetPullRequest()
    if (pullRequest === undefined) {
      throw new Error('no pull request')
    } else {
      const commentStr = await getWorkflowArtifactsComment()
      if (commentStr) {
        await addCommentToPullAndIssues(pullRequest, commentStr)
      } else {
        const errorNoArtifacts = getBoolInput('errorNoArtifacts', {
          defaultValue: true
        })
        if (errorNoArtifacts) {
          throw new Error('no artifacts')
        }
      }
    }
  })
}
