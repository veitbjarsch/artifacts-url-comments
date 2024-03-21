// eslint-disable-next-line import/no-unresolved
import {PullRequest} from '@octokit/webhooks-types'
import {
  getBoolInput,
  getCommaDelimitedStringArrayInput,
  payloadOrInput
} from '../helpers/input-helpers'
import {getPullRequestIssues} from './get-pull-request-issues'

export async function getPullRequestIssuesActionWorker(): Promise<number[]> {
  const payload = payloadOrInput<'pull_request'>('pullRequest')
  const closeWords = getCommaDelimitedStringArrayInput('closeWords')
  const caseSensitive = getBoolInput('caseSensitive')
  const branchIssueWords = getCommaDelimitedStringArrayInput('branchIssueWords')
  const branchDelimiters = getCommaDelimitedStringArrayInput('branchDelimiters')
  const usePullTitle = getBoolInput('usePullTitle')
  const usePullBody = getBoolInput('usePullBody')
  const useBranch = getBoolInput('useBranch')
  const useCommitMessages = getBoolInput('useCommitMessages')
  const pullRequest = payload.pull_request as PullRequest
  return await getPullRequestIssues(
    pullRequest,
    closeWords,
    caseSensitive,
    branchIssueWords,
    branchDelimiters,
    usePullTitle,
    usePullBody,
    useBranch,
    useCommitMessages
  )
}
