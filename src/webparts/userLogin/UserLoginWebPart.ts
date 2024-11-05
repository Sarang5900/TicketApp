import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'UserLoginWebPartStrings';
import UserLogin from './components/UserLogin';
import { IUserLoginProps } from './components/IUserLoginProps';

export interface IUserLoginWebPartProps {
  description: string;
}

export default class UserLoginWebPart extends BaseClientSideWebPart<IUserLoginWebPartProps> {

  private onLoginFail = (): void => {
    console.log("Login Failded");
    
  }
  public render(): void {
    const element: React.ReactElement<IUserLoginProps> = React.createElement(
      UserLogin,
      {
        description: this.properties.description,
        context: this.context, 
        onLoginFail : this.onLoginFail,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
