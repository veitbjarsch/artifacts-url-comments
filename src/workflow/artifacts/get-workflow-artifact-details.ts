// eslint-disable-next-line import/named
import {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods'
import {payloadOrInput} from '../../helpers/input-helpers'
import {useOctokit} from '../../helpers/use-octokit'
type ListWorkflowRunArtifacts =
  RestEndpointMethodTypes['actions']['listWorkflowRunArtifacts']

export interface WorkflowArtifactDetails {
  id: number
  name: string
  httpUrl: string
}
/*
  gets all artifacts for workflow run or from input ( for when using workflow_run_conclusion_dispatch)
  returning the id, name and most importantly the html url to the artifact
*/
export async function getWorkflowArtifactDetails(): Promise<
  WorkflowArtifactDetails[]
> {
  return useOctokit(async octokit => {
    const artifactDetails: WorkflowArtifactDetails[] = []
    const payload = payloadOrInput<'workflow_run'>('workflowPayload')
    const workflowRun = payload.workflow_run
    const repoHtmlUrl = payload.repository.html_url

    const checkSuiteNumber = workflowRun.check_suite_id
    const artifactsUrl = workflowRun.artifacts_url
    const artifacts: ListWorkflowRunArtifacts['response']['data']['artifacts'] =
      await octokit.paginate(artifactsUrl, {
        per_page: 100
      })

    for (const artifact of artifacts) {
      const artifactDetail = {
        id: artifact.id,
        name: artifact.name,
        httpUrl: getArtifactUrl(repoHtmlUrl, checkSuiteNumber, artifact.id)
      }
      artifactDetails.push(artifactDetail)
    }
    return artifactDetails
  })
}

//https://github.com/tonyhallett/DummyZipVsix/suites/2299172325/artifacts/48199605
function getArtifactUrl(
  repoHtmlUrl: string,
  checkSuiteNumber: number,
  artifactId: number
): string {
  return `${repoHtmlUrl}/suites/${checkSuiteNumber}/artifacts/${artifactId.toString()}`
}
