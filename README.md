# Employee Directory

A small Angular application that saves employee records in Cloud Firestore. The entry form collects a name, date of birth, city, salary, optional gender and optional email. **Employee List** retrieves the saved records and displays all six fields in a table.

## Run locally

Use Node.js 22 and npm

```bash
git clone https://github.com/thejosht/seg3502-lab5-employees.git
cd seg3502-lab5-employees
npm ci
npm start
```

Open http://localhost:4200. An internet connection is required for Firebase. No separate server is needed.

The Firebase web configuration is included in `src/environments/environment.ts`, so the shared demo works without entering new settings. These are client configuration values, not an administrator credential. Access is controlled by Firebase Authentication and `firestore.rules`.

## Using the directory

Fill in the required fields and select **Submit**. After Firestore confirms the save, the app opens **Employee List**. The list also works after a page refresh. Failed saves leave the form intact and show an error. The list has loading, empty and retry states.

Birthdays are stored as `YYYY-MM-DD` strings so they do not shift when the browser uses a different time zone. Salary is stored as a number. Records are kept in the `employees` collection.

## Demo access

Use fictional data only. The app automatically signs visitors in anonymously. Signed-in visitors can read all demo records and create valid records, but cannot edit or delete them. Other database paths are denied. This is a shared demonstration, not a private employee management system.

The Firebase project uses the no-cost Spark plan. Its free quota is shared by everyone using this configuration.

## Use another Firebase project

1. Create a Firebase project and register a web app.
2. Create the default Cloud Firestore database in production mode.
3. Enable **Authentication → Sign-in method → Anonymous**.
4. Copy the web app settings into `src/environments/environment.ts`.
5. Publish the contents of `firestore.rules` in the Firestore Rules editor. If using the Firebase CLI instead, set the project ID in `.firebaserc` before deploying rules.

Never commit service account keys or other administrator credentials.

## Checks

```bash
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

Chrome is required for the test command. The automated tests cover form validation, successful and failed saves, duplicate submission prevention, date conversion, table rendering, loading, retries and subscription cleanup.

The application retains Angular 18 and AngularFire 18 for starter compatibility. Dependency audits still flag older packages in this stack; it should be upgraded before production use. Do not use `npm audit fix --force` without planning the Angular migration.

## Documentation

[AngularFire Firestore](https://github.com/angular/angularfire/blob/main/docs/firestore.md) · [Firestore setup](https://firebase.google.com/docs/firestore/quickstart) · [Security rules](https://firebase.google.com/docs/firestore/security/rules-conditions)
