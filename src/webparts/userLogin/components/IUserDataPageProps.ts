import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IFormData } from '../../Types/formDataTypes';

export interface IUserDataPageProps {
  context: WebPartContext;
  userEmailOrPhone: string;
  onDelete: (id: string) => Promise<void>; 
  onUpdate: (updatedData: IFormData) => Promise<void>;
  userId: string | undefined;  
}
