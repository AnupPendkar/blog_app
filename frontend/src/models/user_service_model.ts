export interface ILoginParams {
  username: string;
  password: string;
  client_ip: string;
}

export interface ILoginRes {
  access: string;
  refresh: string;
}
