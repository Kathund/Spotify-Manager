type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: RequestMethod;
  raw?: boolean;
  noCache?: boolean;
}
