export interface CollectionItem {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  uid: string;
  isPublic: boolean;
}

// Postman API types
export interface PostmanCollection {
  info: {
    _postman_id: string;
    name: string;
    description?: string;
    schema: string;
  };
  item: PostmanItem[];
  variable?: PostmanVariable[];
}

export interface PostmanItem {
  name: string;
  request?: PostmanRequest;
  response?: any[];
  item?: PostmanItem[]; // For folders
}

export interface PostmanRequest {
  method: string;
  header?: PostmanHeader[];
  body?: PostmanBody;
  url: PostmanUrl | string;
  description?: string;
}

export interface PostmanHeader {
  key: string;
  value: string;
  type?: string;
  disabled?: boolean;
}

export interface PostmanBody {
  mode: "raw" | "urlencoded" | "formdata" | "file" | "graphql";
  raw?: string;
  urlencoded?: Array<{ key: string; value: string }>;
  formdata?: Array<{ key: string; value: string; type?: string }>;
  options?: {
    raw?: {
      language?: string;
    };
  };
}

export interface PostmanUrl {
  raw: string;
  protocol?: string;
  host?: string[];
  port?: string;
  path?: string[];
  query?: Array<{ key: string; value: string }>;
  variable?: PostmanVariable[];
}

export interface PostmanVariable {
  key: string;
  value: string;
  type?: string;
  enabled?: boolean;
  description?: string;
  disabled?: boolean;
}

// Environment types
export interface PostmanEnvironment {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  uid: string;
  isPublic: boolean;
  values: PostmanVariable[];
}

// Auth types
export interface PostmanAuth {
  type:
    | "apikey"
    | "awsv4"
    | "basic"
    | "bearer"
    | "digest"
    | "hawk"
    | "noauth"
    | "oauth1"
    | "oauth2"
    | "ntlm";
  apikey?: Array<{ key: string; value: string; type: string }>;
  awsv4?: Array<{ key: string; value: string; type: string }>;
  basic?: Array<{ key: string; value: string; type: string }>;
  bearer?: Array<{ key: string; value: string; type: string }>;
  digest?: Array<{ key: string; value: string; type: string }>;
  hawk?: Array<{ key: string; value: string; type: string }>;
  oauth1?: Array<{ key: string; value: string; type: string }>;
  oauth2?: Array<{ key: string; value: string; type: string }>;
  ntlm?: Array<{ key: string; value: string; type: string }>;
}

// Event types for scripts
export interface PostmanEvent {
  listen: "prerequest" | "test";
  script: {
    id?: string;
    type: "text/javascript";
    exec: string[];
    src?: string;
  };
}

// Response types
export interface PostmanResponse {
  id?: string;
  name?: string;
  originalRequest?: PostmanRequest;
  status?: string;
  code?: number;
  _postman_previewlanguage?: string;
  header?: PostmanHeader[];
  cookie?: PostmanCookie[];
  body?: string;
  responseTime?: number;
}

export interface PostmanCookie {
  domain: string;
  expires?: string;
  httpOnly?: boolean;
  name: string;
  path: string;
  secure?: boolean;
  value: string;
}

export interface PostmanWorkspacesListResponse {
  workspaces: PostmanWorkspaceItem[];
}

// Collection List Response
export interface PostmanCollectionListItem {
  id: string;
  name: string;
  owner?: string;
  uid: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  fork?: {
    label: string;
    createdAt: string;
    from: string;
  };
}

// API Response types
export interface PostmanApiResponse<T> {
  [key: string]: T;
}

export interface PostmanCollectionResponse {
  collection: PostmanCollection;
}

export interface PostmanCollectionsListResponse {
  collections: PostmanCollectionListItem[];
}

export interface PostmanEnvironmentResponse {
  environment: PostmanEnvironment;
}

export interface PostmanEnvironmentListItem {
  id: string;
  name: string;
  owner?: string;
  uid: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface PostmanEnvironmentsListResponse {
  environments: PostmanEnvironmentListItem[];
}

// Error response type
export interface PostmanErrorResponse {
  error: {
    name: string;
    message: string;
    details?: any;
  };
}

// Request execution types for our API tester
export interface TestRequestParams {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  followRedirects?: boolean;
  validateSSL?: boolean;
}

export interface TestResult {
  success: boolean;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  data?: any;
  error?: string;
  duration?: number;
  size?: number;
  redirects?: Array<{
    url: string;
    status: number;
  }>;
}

// Extended request types for more features
export interface PostmanRequestWithAuth extends PostmanRequest {
  auth?: PostmanAuth;
}

export interface PostmanItemWithEvents extends PostmanItem {
  event?: PostmanEvent[];
}

// Workspace types (if needed later)
export interface PostmanWorkspaceItem {
  id: string;
  name: string;
  type: "personal" | "team";
  visibility: "personal" | "private" | "public" | "team" | "partner";
  createdBy: string;
}

export interface PostmanWorkspace {
  id: string;
  name: string;
  type: "personal" | "team";
  visibility: "personal" | "private" | "public" | "team" | "partner";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  description: string | null;
  collections: PostmanCollectionListItem[];
  environments: PostmanEnvironmentListItem[];
}

// Mock server types (for future enhancement)
export interface PostmanMockServer {
  id: string;
  owner: string;
  uid: string;
  collection: string;
  environment?: string;
  mockUrl: string;
  name: string;
  config?: {
    headers?: PostmanHeader[];
    matchBody?: boolean;
    matchQueryParams?: boolean;
    matchWildcards?: boolean;
    delay?: number;
  };
}

// Test assertion types
export interface PostmanTest {
  name: string;
  script: string;
  passed?: boolean;
  error?: string;
  executionTime?: number;
}

// Collection run types
export interface CollectionRunOptions {
  environment?: string;
  globals?: Record<string, any>;
  iterationCount?: number;
  delayRequest?: number;
  data?: any[];
  folder?: string;
  bail?: boolean;
}

export interface CollectionRunResult {
  collection: {
    id: string;
    name: string;
  };
  environment?: {
    id: string;
    name: string;
  };
  iterations: number;
  totalTime: number;
  totalRequests: number;
  testResults: {
    passed: number;
    failed: number;
    total: number;
  };
  requests: Array<{
    name: string;
    url: string;
    method: string;
    status: number;
    time: number;
    tests: PostmanTest[];
  }>;
}
