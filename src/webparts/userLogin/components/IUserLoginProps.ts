import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IUserLoginProps {
  description: string;
  context: WebPartContext;
  onLoginFail: ()=> void;
}
