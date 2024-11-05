declare interface IAuthContainerWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  WelcomeText: string;
  RegisterButtonText: string;
  LoginButtonText: string;
  LoginTitle: string;
  LoginDescription: string;
}

declare module 'AuthContainerWebPartStrings' {
  const strings: IAuthContainerWebPartStrings;
  export = strings;
}
