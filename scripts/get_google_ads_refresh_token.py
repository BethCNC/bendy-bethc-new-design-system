# scripts/get_google_ads_refresh_token.py
import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow

def main():
    # Path to your client secret file
    CLIENT_SECRET_FILE = 'client_secret_440642074987-v842gf2ccnanck3r0heng6e47pct5nsn.apps.googleusercontent.com.json'
    SCOPES = ['https://www.googleapis.com/auth/adwords']

    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
    creds = flow.run_local_server(port=0)
    print("\nYour refresh token is:\n")
    print(creds.refresh_token)

if __name__ == '__main__':
    main()
