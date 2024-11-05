import * as React from 'react';
import styles from './AuthContainer.module.scss';
import type { IAuthContainerProps } from './IAuthContainerProps';
import * as strings from 'AuthContainerWebPartStrings';
import BookingForm from '../../registration/components/Registration';
import UserLogin from '../../userLogin/components/UserLogin';

interface IAuthContainerState {
  viewMode: 'buttons' | 'login' | 'register' | 'userData';
  userEmailOrPhone?: string;
}

export default class AuthContainer extends React.Component<IAuthContainerProps, IAuthContainerState> {
  constructor(props: IAuthContainerProps) {
    super(props);

    this.state = {
      viewMode: 'buttons',
    };

    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.handleLoginFail = this.handleLoginFail.bind(this);
  }

  private handleLoginClick(): void {
    this.setState({ viewMode: 'login' });
  }

  private handleRegisterClick(): void {
    this.setState({ viewMode: 'register' });
  }

  private onLoginSuccess(emailOrPhone: string): void {
    this.setState({ userEmailOrPhone: emailOrPhone, viewMode: 'userData' });
  }

  private handleLoginFail(): void {
    this.setState({ viewMode: 'login' });
  }

  public render(): React.ReactElement<IAuthContainerProps> {
    const { context } = this.props;
    const { viewMode } = this.state;

    return (
      <div className={styles.authContainerOuter}>
        <div className={styles.authContainerCard}>
          {viewMode === 'buttons' && (
            <div>
              <h2 className={styles.welcomeText}>{strings.WelcomeText}</h2>
              <div className={styles.buttonContainer}>
                <button
                  onClick={this.handleRegisterClick}
                  className={styles.registerButton}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    margin: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {strings.RegisterButtonText}
                </button>
                <button
                  onClick={this.handleLoginClick}
                  className={styles.loginButton}
                  style={{
                    backgroundColor: '#2196F3',
                    color: '#fff',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    margin: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {strings.LoginButtonText}
                </button>
              </div>
            </div>
          )}

          {viewMode === 'login' && (
            <div style={{ textAlign: 'left', width: '100%' }}>
              <UserLogin
              context={context}
              description={''}
              onLoginFail={this.handleLoginFail} // callback to reset to login
            />
            </div>
          )}

          {viewMode === 'register' && (
            <div style={{ textAlign: 'left', width: '100%' }}>
              <BookingForm context={context} description={''} />
            </div>
          )}

          {/* {viewMode === 'userData' && (
            <UserLogin
              context={context}
              description={''}
              onLoginFail={this.handleLoginFail} // callback to reset to login
            />
          )} */}
        </div>
      </div>
    );
  }
}
