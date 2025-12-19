import { InvocationContext } from '@azure/functions';
import { ChatOpenAI } from '@langchain/openai';
import { getAzureOpenAiTokenProvider } from './auth.js';

export function createModel(context: InvocationContext): ChatOpenAI | undefined {
  const azureOpenAiEndpoint = process.env.AZURE_OPENAI_API_ENDPOINT;
  const githubToken = process.env.GITHUB_TOKEN;

  if (azureOpenAiEndpoint) {
    context.log('Using Azure OpenAI');
    return new ChatOpenAI({
      configuration: { baseURL: azureOpenAiEndpoint },
      modelName: process.env.AZURE_OPENAI_MODEL ?? 'gpt-4o-mini',
      streaming: true,
      useResponsesApi: true,
      apiKey: getAzureOpenAiTokenProvider(),
    });
  }

  if (githubToken) {
    context.log('Using GitHub Models');
    return new ChatOpenAI({
      configuration: { baseURL: 'https://models.inference.ai.azure.com' },
      modelName: process.env.GITHUB_MODEL ?? 'gpt-4o-mini',
      streaming: true,
      apiKey: githubToken,
    });
  }

  return undefined;
}
