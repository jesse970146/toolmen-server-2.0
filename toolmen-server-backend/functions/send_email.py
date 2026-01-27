import smtplib
from email.mime.text import MIMEText
import os

def send_account_created_email(to_email, user, default_password, url, event):
    """
    寄送帳號創建成功通知的 HTML 郵件

    :param to_email: 收件人 Email
    :param default_password: 系統預設密碼
    :param reset_url: 使用者點擊後可更改密碼的連結
    :return: True (成功) / False (失敗)
    """
    sender = os.getenv("GMAIL_USER")
    password = os.getenv("GMAIL_PASS")
    if event == "create":
      html = f"""
      <!DOCTYPE html>
      <html lang="zh-Hant">
      <head>
        <meta charset="UTF-8">
        <title> Toolmen server 帳號建立成功通知</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; padding: 30px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50;">Toolmen server 帳號建立成功通知</h2>
          <p>您好，您的帳號 {user} 已成功建立。</p>
          <p>系統為您設定的預設密碼為：</p>
          <p style="font-weight: bold; color: #e74c3c;">{default_password}</p>
          <p>為了您的帳號安全，請儘快點擊以下連結登入修改密碼：</p>
          <p> {url} </p>
          <p style="margin-top: 30px; font-size: 13px; color: #95a5a6;">※ 如果您並未申請帳號，請忽略此郵件。</p>
        </div>
      </body>
      </html>
      """
    elif event == "reset":
      html = f"""
      <!DOCTYPE html>
      <html lang="zh-Hant">
      <head>
        <meta charset="UTF-8">
        <title> Toolmen server 帳號密碼重設通知</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; padding: 30px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50;">Toolmen server 帳號密碼重設通知</h2>
          <p>您好，您的帳號 {user} 密碼已成功重設。</p>
          <p>系統為您重設的密碼為：</p>
          <p style="font-weight: bold; color: #e74c3c;">{default_password}</p>
          <p>為了您的帳號安全，請儘快點擊以下連結登入修改密碼：</p>
          <p> {url} </p>
          <p style="margin-top: 30px; font-size: 13px; color: #95a5a6;">※ 如果您並未申請帳號，請忽略此郵件。</p>
        </div>
      </body>
      </html>
      """
 

    msg = MIMEText(html, 'html', 'utf-8')
    if event == "create":
      msg['Subject'] = 'Toolmen server 帳號創建通知'
    elif event == "reset":  
      msg['Subject'] = 'Toolmen server 帳號密碼重設通知'
    msg['From'] = sender
    msg['To'] = to_email

    try:
        smtp = smtplib.SMTP('smtp.gmail.com', 587)
        smtp.ehlo()
        smtp.starttls()
        smtp.login(sender, password)
        status = smtp.send_message(msg)
        smtp.quit()

        if status == {}:
            print('📬 郵件傳送成功！')
            return True
        else:
            print('❌ 郵件傳送失敗！')
            return False
    except Exception as e:
        print(f"⚠️ 發送失敗：{e}")
        return False

# =======================
# CLI 測試用（可直接執行）
# =======================
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="寄送帳號建立成功通知郵件")
    parser.add_argument('--to', required=True, help='收件人 Email')
    parser.add_argument('--user', default='Temp', help='使用者')
    parser.add_argument('--password', default='Temp@1234', help='預設密碼')
    parser.add_argument('--url', default='https://yourwebsite.com/reset-password', help='修改密碼網址')
    parser.add_argument('--event', default='create', help='創建User或是重設密碼')
    args = parser.parse_args()

    send_account_created_email(args.to, args.user, args.password, args.url, args.event)

# from send_account_email import send_account_created_email

# send_account_created_email(
#     to_email="user@example.com",
#     user = "user",
#     default_password="Temp@1234",
#     url="https://yourwebsite.com/reset-password"
# )
