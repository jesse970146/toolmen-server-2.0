# 檔名：password_generator.py

import random
import string

def generate_password(length=10, use_uppercase=True, use_digits=True, use_special=True):
    """
    產生一組隨機密碼。

    參數：
    - length (int): 密碼長度（預設為12）
    - use_uppercase (bool): 是否包含大寫字母（預設為True）
    - use_digits (bool): 是否包含數字（預設為True）
    - use_special (bool): 是否包含特殊符號（預設為True）

    回傳：
    - str: 一組隨機密碼
    """
    characters = list(string.ascii_lowercase)  # 小寫字母

    if use_uppercase:
        characters += list(string.ascii_uppercase)
    if use_digits:
        characters += list(string.digits)
    if use_special:
        characters += list("!@#$%^&*()-_=+[]{};:,.<>?")

    if not characters:
        raise ValueError("至少要選擇一種字元類型")

    password = ''.join(random.choice(characters) for _ in range(length))
    return password

# 可選：允許當作 script 測試
if __name__ == "__main__":
    print("預設密碼:", generate_password())
    print("16位不含特殊符號密碼:", generate_password(length=10, use_special=False))
