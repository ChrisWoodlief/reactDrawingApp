# 🎨 React Drawing App

## Architecture Choices


## Main Technical Choices
### SVG for drawing images
SVG was chosen to handle image drawing rather than an html canvas. SVG allows for images to scale well to different size displays and also allows for the individual line data to be saved. This extra data about lines can then be used to do things such as replay the drawing, or to delete certain lines with an eraser.

### Next.js and Next-Auth
Next.js was chosen as a framework because of how it allows a fullstack application to be created with a single toolset. Next.js is popular and has lots of support online along with tools built for it (such as Next-Auth which I used for authentication). Next.js also has lots of rendering options such as passing props generated on the backend directly to the frontend components which I think makes the code cleaner. create-next-app was used to bootstrap the project.

### Postgres and Prisma (ORM)
A relational database seemed to make sense for database a lot of data has relations (Such as a User having Drawings and Drawings having Strokes). Prisma is a popular ORM well known for working great with Next.js.

### Bootstrap / React-bootstrap
Bootstrap was chosen as a design library. Bootstrap is well known and has great features to make responsive website design easy. The Material-UI React UI library was also considered and could have accomplished the job as well.


## Unimplemented things / Trade-offs
### More uniform login and registration flow

### Typescript

### Testing

### Front-end loading indication / spinners

### Better Erroring

##How to run
First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
