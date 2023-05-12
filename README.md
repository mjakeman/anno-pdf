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

## Try
Please allow up to 30s when first accessing Anno for the container to resume.

[Click here to try Anno](https://anno-pdf.herokuapp.com/).

### Deployment Details
Anno is deployed on a production server using Heroku Dynos.

The frontend is deployed to https://anno-pdf.herokuapp.com/.

The backend is deployed to https://anno-pdf-backend.herokuapp.com/.


## Building
Anno is developed using a deployment-first philosophy.

## Deployment


## Running Locally


## Wiki & Meetings


## Project Management
