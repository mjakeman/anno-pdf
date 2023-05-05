# Push to Heroku

Don't use any of this - it is automatically setup to push whenever a new commit is made on GitHub.

## Git

From root directory (to `anno-pdf`):

```
git push heroku $(git subtree split --prefix frontend $(git symbolic-ref --short -q HEAD)):main --force
```

Adjust as needed.

## Firebase Config

Generate a base64 encoded string of the firebase serviceAccount.json:

```
openssl base64 -in anno-e7aa2-firebase-adminsdk-uz352-63747db806.json -out firebaseConfigBase64.txt -A
```