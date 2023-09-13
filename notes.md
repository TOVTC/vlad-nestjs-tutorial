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

## Modules
* app.module.ts is similar to the App file in a React or Vue application - it is the main module/the app that will import other modules
    * "A module is a class annotated with a @Module() decorator. The @Module() decorator provides metadata that Nest makes use of to organize the application structure."
* The export keyword allows a Module to be available across an application, otherwise it will only be available within a specific file - make sure to also import a module in the App imports statement
* main.ts is where the app is launched (manually change the port number from 3000 since 3000 is the default port number for REact)
* Nest CLI has an option to allow automatic generation of modules - it also automatically imports the module into the app
```
nest g module <name-of-module>
```

## Controllers and Services
* The logic for a Nest Js application is separated into two files - controllers and service
    * "Controllers are responsible for handling incoming requests and returning responses to the client." (annotated with @Controller())
    * Services (aka providers) are responsible for executing the business logic: "Providers are a fundamental concept in Nest. Many of the basic Nest classes may be treated as a provider – services, repositories, factories, helpers, and so on. The main idea of a provider is that it can be injected as a dependency; this means objects can create various relationships with each other, and the function of "wiring up" these objects can largely be delegated to the Nest runtime system." (annotated with @Injectable())
* Don't forget to import the service and controller into the module file
* The controller receives a request from the internet and it calls a function from the service before returning the result of that function to the browser
* In classic JavaScript, the controller would have to instantiate an instance of the Service before being able to use it
* In Nest Js, we use dependency injection, which means that instead of the controller declaring and handling a new insance of the service, it receives the service as an argument in its constructor and Nest Js handles the instatiation of the service
    * Dependency injection in Nest Js basically allows us to not have to handle dependency management
* Nest Js also converts the datatype in the headers of the response based on the datatype of the returned value
* The controllers handle the request and return the body if needed - might check headers or any work required by the request - the execution is offloaded to the service
* Usually the pattern is that there is a matching function in the service for each of the routes defined in the controller