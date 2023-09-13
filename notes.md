## What is Nest Js

* Nest Js is a Node Js backend framework that embraces TypeScript and solves the weak point of Express Js which is architecture
    * It provides direction on have to structure and scale a project, while still using Express Js under the hood
* It allows for creation of testable, scalable, and easily maintainable applications
* Modularity is important for Nest Js and uses concepts like dependency injection (has been called Angular for backend)
* Nest Js provides good structure and modularity for apps, has support for TypeScript, GraphQL, microservices, and REST APIs

## Installing Nest Js
```
npm i -g @nestjs/cli
nest new <project-name>
```

## Intro to Nest Js Project
* app.module.ts is similar to the App file in a React or Vue application - it is the main module/the app that will import other modules
* "A module is a class annotated with a @Module() decorator. The @Module() decorator provides metadata that Nest makes use of to organize the application structure."
* The export keyword allows a Module to be available across an application, otherwise it will only be available within a specific file - make sure to also import a module in the App imports statement
* main.ts is where the app is launched (manually change the port number from 3000 since 3000 is the default port number for REact)
* Nest CLI has an option to allow automatic generation of modules - it also automatically imports the module into the app
```
nest g module <name-of-module>
```