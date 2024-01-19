import { IUserResponse } from 'src/interfaces';

export const welcomeTemplate = (userResponse: IUserResponse): string => {
  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Welcome to FUL.AM</title>
      </head>
      <body>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 20px 0; text-align: center; background-color: #148053;">
                    <h1 style="color: #fff;">Welcome to FUL.AM</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <p>Your user profile credentials is</p>
                    <p><b>username: ${userResponse.email}</b></p>
                    <p><b>password: ${userResponse.password}</b></p>
                    <p>If you didn't create an account on our website, you can safely ignore this email.</p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f0f0f0; text-align: center; padding: 20px;">
                    <p>&copy; 2024 FUL.AM All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return content;
};