import { ExampleGetResponse } from '../state/actions/ExampleService';
import Request from './Request';

export const exampleGet = async (): Promise<ExampleGetResponse> =>
    Request.get('https://www.example.com');