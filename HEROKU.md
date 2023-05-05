# Push to Heroku

## Frontend

From root directory (to `anno-pdf`):

```
git push heroku $(git subtree split --prefix frontend $(git symbolic-ref --short -q HEAD)):main --force
```

## Backend

TBA