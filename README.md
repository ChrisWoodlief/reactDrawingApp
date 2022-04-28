# 🎨 React Drawing App

## Architecture Choices


## Main Technical Choices
### SVG for drawing images
SVG was chosen to handle image drawing rather than an html canvas. SVG allows for images to scale well to different size displays and also allows for the individual line data to be saved. This extra data about lines can then be used to do things such as delete certain lines with an eraser that would not be possible otherwise.

### Next.js and Next-Auth
Next.js was chosen as a framework because of how it allows a fullstack application to be created with a single toolset. Next.js is popular and has lots of support online along with tools built for it (such as Next-Auth which I used for authentication). Next.js also has lots of rendering options such as passing props generated on the backend directly to the frontend components which I think makes the code cleaner. create-next-app was used to bootstrap the project.

### Postgres and Prisma (ORM)
A relational database seemed to make sense for database a lot of data has relations (Such as a User having Drawings and Drawings having Strokes). Prisma is a popular ORM well known for working great with Next.js.

### Bootstrap / React-bootstrap
Bootstrap was chosen as a design library. Bootstrap is well known and has great features to make responsive website design easy. The Material-UI React UI library was also considered and could have accomplished the job as well.


## Unimplemented things / Trade-offs
### More uniform login and registration flow
I created a registration page at /register but for login the built in page from Next-Auth is being used. In a real application is would be better to build out both of these pages to have more uniform pages.

### Typescript
Typescript would have been nice to have for more complicated objects. In drawArea I have added documentation about the component about the structure of the data. This would be nice to have in Typescript instead.

### Testing
Unit testing and component testing would have been nice additions to ensure new changes do not break existing code.

### Front-end loading indication / spinners
In a production application where there is more data and the server could take longer to respond it is important to have loading indications for the users.

### Better Erroring
In "Register.js" I have added code in the frontend to pass errors along to users in the UI. It would be nice to have this kind of logic throughout the application. "Error Boundaries" in react might be useful as well to catch unexpected errors in the frontend.

### Transactions
It would have been nice to take some time to see how Prisma ORM handles transactions. A transaction could have been used in /saveDrawing to ensure a drawing is not created without strokes.

##How to run
1. Run a Postgres database
Update the DATABASE_URL database string in the .env file (included in the project for simplicity) to match your Postgres database location. (Any other database should work fine as well if it is compatible with the Prisma ORM). In postgres you should make a database called "drawingAppDb"

2.Run "npx prisma migrate dev --name init"
This will generate the proper sql columns based on the Prisma schema in the project

3. Install packages and run
npm install
npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the project.

The two main pages to explore are:
http://localhost:3000/DrawingFeed
and
http://localhost:3000/Create
The navigation bar that exists on both pages can be used to create an account and login.
