# Anno
A collaborative PDF annotation suite for the web.

Created for SOFTENG 750 at the University of Auckland.

## About
**Team:** Fearless Foxes

**Members:**
 * Matthew Jakeman (mjak923)
 * Ben Lowthian (blow247)
 * Ojas Madaan (omad882)
 * Jia Tee (jtee256)
 * Jordan York (jyor212)
 * Matan Yosef (myos911)

## Features
Anno supports:

 - Real time collaborative whiteboard
 - PDF annotations with text and pen
 - Share documents with permissions
 - Email based invitations
 - File management and upload
 - Export annotated documents to PDF

## Technology
Anno is built on modern web technology, utilising MongoDB, Express, React, and Node.js (i.e. the MERN stack).

It is composed of two modules: the
`frontend` and the `backend`.

### Common Technologies
 * **Socket.io** brings real-time collaboration primitives and enables communication with the backend server.
 * **TypeScript** adds typing and structure in order to provide a necessary  level of compile-time safety given the complexity of the project.

### Frontend Libraries
 * **React** is used for building the interface. Anno takes advantage of React's flexible state management to create a complex fully-interactive whiteboard with real time collaboration built-in from the start.
 * **fabric.js** provides the client-side whiteboard implementation. This is extended with a collaboration layer which marshals additions, modifications, and deletions from the canvas with other peers and the backend persistence store.
 * **PDF.js** is used to render PDF pages. This is a mature and scalable solution which neatly integrated into fabric.js.
 * **jsPdf** (not to be confused with PDF.js) is used for implementing PDF export by constructing a new PDF document from our internal annotation representation.
 * **Tailwind CSS** is used to make styling more maintainable. Combined with React, it allows for efficient construction of reusable components.
 * **Cypress** is a frontend E2E testing framework used to validate the behaviour of the frontend.

### Backend Libraries
 * **Express** is the web framework powering the Anno backend. It allows for efficient iteration and compatibility with the data structures used in the frontend.
 * **Mongoose** is our ORM for persisting application state to MongoDB. It provides a helpful convenience layer over Mongo.
 * **Jest** is the JavaScript testing framework used to create the backend test fixtures.
 * **Nodemailer** provides email sending capabilities for the invitation system.

### Auxiliary Technologies
 * **Heroku** is the cloud service platform used to deploy Anno. We achieve continuous deployment for every commit on the `main` branch.
 * **MongoDB** provides data persistence for users, documents, and annotations. This allows for annotations to be stored across restarts of the backend server.
 * **Mailgun** is the service provider for email notifications.
 * **Firebase** provides authentication and token functionality which is integrated into our backend. Requests are secured to prevent data leakage.
 * **Amazon S3** stores uploaded documents and enables the application to fetch them on-demand. We use Amazon's highly performant CDN to provide fast and efficient document retrieval.
 * **GitHub Actions** provided continuous integration to the project. Four build checks (for the frontend and backend across the latest Node.js and the Node.js LTS) and two deployment tasks (for frontend and backend deployment to Heroku) were used.

## Try
Please allow up to 30s when first accessing Anno for the container to resume.

[Click here to try Anno](https://anno-pdf.herokuapp.com/).

### Deployment Details
Anno is deployed on a production server using Heroku Dynos.

The frontend is deployed to https://anno-pdf.herokuapp.com/.

The backend is deployed to https://anno-pdf-backend.herokuapp.com/.


## Building
Anno is developed using a cloud-first philosophy. The backend and frontend can be run locally however it depends on the presence of the MongoDB server and S3 bucket for document delivery.

**Please ensure an internet connection is present when following the instructions below.**

### Environment Setup
A `.env` file is needed for both the frontend and the backend, containing API Keys and other relevant deployment information.

#### Frontend
Place a file at `/backend/.env` and enter the following content:

```dotenv
MONGODB_URI=mongodb+srv://omad882:R3lbrJwvk4ZMsbQX@anno-database.0tn95rb.mongodb.net/?retryWrites=true&w=majority
PORT=8080
ENVIRONMENT=PROD
AWS_ACCESS_KEY=AKIASUU4VLBKMPU6CR6A
AWS_SECRET_ACCESS_KEY=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
AWS_BUCKET=anno-bucket
TEST_UID=PbQHNz29zZWF88ermprFvyGsbf83
FIREBASE_CONFIG_BASE64=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiYW5uby1lN2FhMiIsCiAgInByaXZhdGVfa2V5X2lkIjogIjYzNzQ3ZGI4MDZjY2FhYzk5YWI0NzQ3ZDNkOTdhYWNlOTdiODRmMGEiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2QUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktZd2dnU2lBZ0VBQW9JQkFRQzNMUDR6M2tDYzFNSFpcbkU2MUFpY0p3MzhZYXJVU254b0xmS0dJVTArQmNxcnNkNnJEbnFDZVQzNHVXd054bytXdVRTM000Q1VnNGF2Wnhcbm5FZ0l2Sm82bFpDU2Q3bHM3WUVZOCtnMDY1aG4vcUJwcEhqN0llbFBuREJiYU02cno5c1BDREtrc0tRakxDdC9cbnpsWDBtQ2hTa1hQb1hRM2ZjZFV6WkxnRzVWUGxycCtDYW4yTTNQZHQzYllqZG1zcnZJSVZCTXI3c1lJMmFVSExcbjlpRmpsZ29FYzBuNTdpenBxTjl4Tzd1blRON2pjK2FkSms4Rm5oNU0xaXM0ZXIwTGdKa0FGanBvR3k0QThxaEhcbkNiZW9mbStVS2ZodTVhald2NU1CaEFqUng1RmdhbCttTHdDc2tHUitMQmVveGtDTWlTQ3ZhcG1SNEIzVE1MMUdcblZNZlFRWVByQWdNQkFBRUNnZjlvZ1cyaXVEaXpDSFp6cWZEbllUOWpRdkxSZmw2ZTZDTENaNDdqR2plRGlvOVRcblY0UmRpZlh1SUtvZmd1am4zcnFyNnZ4dDBVK3AvT3E2QXlpa0RFdTR5MytGWmpySHdBNW5XTUNpVkRsMDRxWVVcblNrSFlJZVJlQnlISWswbzV1OXkrNFc1MUZhZXI5N0gyRGlYOEgwVWE4dUU4VFRBZEJCd0NtZGVBd2xYVU00dVlcbmlGRGZobmJzS0I4d2xkRUlxZEdlMENsUStvT3NQcWRaMzZYUy8rU2plQld4TmFTRjhiSGZROWlMVEdGR2owTnZcbnRUNVFScTZndEZsMXRmejJaczJUTmt6dmVXcXNZeHArZTJsaWRweVA2ZTlNZDVXYU1jQ2NTTkhyd21CNTcyZTFcbmxpd3VOOWluajR2UGdUeTVhUk5ralNnQVBEM3gvQ21FVGdnRDRhMENnWUVBK3MyTm9zWm5lajRaT2NOWWYyYjVcbi8vZWlhMVhraW5kRklEbXNPYlJNNzVIeVFsVnIvRFlmR1BLb2lNSFZLcWZnU1RCY2pzSHE4R0pDQjUwRjFybStcbmtDcDhsS0xsYzJUR3prSnZ0MTNMYUh2WUxCY2d1NHFYckQ1cGpGOXBveHBLbkVoMzZxZTlEbjJNSWtCK0ZhQ2xcbklmRklMeWhvWE5YbDFyaVFQSzdUd1c4Q2dZRUF1dml4eGt3TFY1Z0o3eWh4MlBZUkoxbTRjay9FZ0RKRml2VmVcbmRBdWhvRXFIalZrMVc3a0lxYk9GTHlRZWl6U1M5bFgwZWRNQW1hOUg3eUJFc1ZYWXBhWll1TEhXWFkxc0JndVBcblc1SkxiVXRscXc2M0F5Ni9MM1JESGJyZXVTNU43cU8rRy9vMVdKQUc3QmNVTHMzdXF0dWNjRUtjTzhGbCtqaHRcblo4NkZMMFVDZ1lFQXMzRmloellCVDFzaTNVdEJCRlovUkg2L1BLREYxYlFrUnp3OFYwVURUdDFUUWRhd1hsR3lcbnlqekVES1R5aVlSM1dxWTVjd0tYdjhudGlGajJsbjFyTk9iUkg5KzAzMjBaT1BZYnpFeFZmcm90SHM2bFlzbDBcblg0NkFJaWthQWRLTDAybWVNc3cwM2l0Qm1qZ2VmZ2JrWDNhc3VPRG1XcFhIem10YTk2LzJYZzBDZ1lBaTJxT0JcblBNSE1oV29zckJSMUJvSHlIUGFXVUtwbjMzYzVUVDViVWFQQ2xzSW9KbDRkQ0NSR1JsSG9sTW9nMXg4aVRxbXhcbllCVTNrUVpPM0d3Unh0Z0pJVFplejhBUFZvS3hxY3dDblFYMGpONmFBYmM2SDZmQ04rRWZGS3ZhUjNoOXFRYVNcbmZwVWRPbFFnQkxsZGRFUXVrNXZaRFlIRVhld2R0aEVuRGNla0pRS0JnUUNKRzgvVDV1Smx0UklkSEovaEV1aFBcbnRDRWx5R2ZsV0Y2UHBlQ0Vjc21STE90aVZvODkyWkVCTWN5S2Uyb3hTQWFia2RhQTZyTy9xYndWd21oOERjV1Vcbkh5VHB4dE5wSFZsNnEwK25LM29ZK3o3bFpYTGc0NVlnSHVXVGpwMEpEOGdNeXROeFlubkxCMEk5MWV4WmV0Z2VcblN5cmhkaDRUOHA5TytlTHl4aE43cGc9PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImZpcmViYXNlLWFkbWluc2RrLXV6MzUyQGFubm8tZTdhYTIuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTA2NTU2NDg4MjYxNDc0MjQ4Mzk4IiwKICAiYXV0aF91cmkiOiAiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgiLAogICJ0b2tlbl91cmkiOiAiaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4iLAogICJhdXRoX3Byb3ZpZGVyX3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YxL2NlcnRzIiwKICAiY2xpZW50X3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcm9ib3QvdjEvbWV0YWRhdGEveDUwOS9maXJlYmFzZS1hZG1pbnNkay11ejM1MiU0MGFubm8tZTdhYTIuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iCn0K
GMAIL=annoinvites@gmail.com
GMAIL_PASSWORD=OSXQVALHXJENMJXM
FRONTEND_BASE_URL=http://localhost:5173
```

#### Frontend
Place a file at `/frontend/.env` and enter the following content:

```dotenv
VITE_FB_AUTH_API_KEY=AIzaSyA3gTfsWuuEoLZktxhjBRwg1DqsaBbL_OE
VITE_FB_AUTH_AUTH_DOMAIN=anno-e7aa2.firebaseapp.com
VITE_FB_AUTH_PROJECT_ID=anno-e7aa2
VITE_FB_AUTH_STORAGE_BUCKET=anno-e7aa2.appspot.com
VITE_FB_AUTH_MESSAGING_SENDER_ID=412638128489
VITE_FB_AUTH_APP_ID=1:412638128489:web:7e0470f9c0075fb96935f8
VITE_BACKEND_URL=http://localhost:8080
VITE_FRONTEND_URL=http://localhost:5173
```

### Running Locally
With the S3 Bucket and MongoDB instance configured as above, the project is now ready to be run locally.

You will need to run both the frontend and the backend simultaneously for the application to function.

#### Compilation
Anno is a typical Node.js project. You can build it using `npm`.

In terminal 1:

```bash
# Enter the frontend directory
cd frontend

# Install dependencies
npm install

# Run frontend app
npm run dev
```

In terminal 2:

```bash
# Enter the backend directory
cd backend

# Install dependencies
npm install

# Run backend app
npm run dev
```

## Project Management
The team decided on using Jira for project management, as it is a powerful and widely used issue tracker solution which the team is experienced with. This is used as our 'source of truth' for task allocations.

The Jira instance can be found at https://pdfcollab.atlassian.net/.

Access permission has been given to Andrew Meads. Please contact the team for any additional access to the Jira board.

### Branch Strategy
A branch has been created for each Jira ticket. The Jira workflow is set up to automatically update issue statuses when certain actions occur. For example, when opening a Pull Request, the issue will be moved to the 'In Review' status.

Branch names should take the format of `PDF-<key>-optional-short-description-of-issue`.

### Feature Freeze
A feature freeze was instituted on the morning of the deliverable. All further work on Friday 12 May  focused on polish, robustness, and code quality.


## Wiki, Meetings, and Communication

Notion was used as our Wiki and Knowledge Base. All meeting minutes, architectural decisions, and supplementary documentation is recorded here.

The Notion can be viewed through this link: [Team Notion Site Invitation](https://uncovered-aftershave-870.notion.site/SOFTENG-750-Anno-Team-Fearless-Foxes-8ea5b6d8044e467793413bf6cf217367).

### Meetings
The team had an 'official' meeting weekly and a shorter standup on a close-to-daily basis. Task allocations from meetings are recorded comprehensively on Jira. Where architectural decisions were made, mainly in the early weeks, these are recorded on Notion.

### Slack
A Slack workspace was created for asynchronous communication. The team used this for general discussion, requesting code reviews, and technical help.