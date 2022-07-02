import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export interface QueryOptions {
  page?: number;
  limit?: number;
}

export interface SearchParamOptions {
  [key: string]: unknown;
}

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

interface PaginatorInfo<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Settings {
  id: string;
  options: {
    siteTitle: string;
    siteSubtitle: string;
    currency: string;
    logo: Attachment;
  };
}

export interface Attachment {
  id: string;
  original: string;
  thumbnail: string;
}

export interface User {
  id: string;
  name: string;
  profile: {
    id: string;
    bio: string;
    contact: string;
    avatar: Attachment;
  };
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

