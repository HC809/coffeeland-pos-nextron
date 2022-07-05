export interface ILoginUser {
  username: string;
  password: string;
}

export interface IAuthResponse {
  username: string;
  name: string;
  role: string;
  token: string;
}

export interface ILoggedUser {
  username: string | null;
  name: string | null;
  token: string | null;
  logged: boolean;
}
