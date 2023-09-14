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

## Connecting a Containerized Database and ORM
* In the root directory, create a docker-compose.yml file and use the following command to run the docker database container
```
docker compose up dev-db -d
```
* You can also check the status of the container by using the following command
```
docker logs <container-id>
```
* This tutorial uses postgres relational database and uses Prisma as the ORM
    * Prisma is like a query builder where you define a model and you can get those models from your JS or TS code
* Primsa will be used to define the database connection logic
* Install Prisma CLI to create schemas, run migrations, and deploy migrations into the database
```
npm i prisma@latest --save-dev
```
* Install Prisma client - Prisma has many clients, so we're installing the one for JavaScript
```
npm i @prisma/client
```
* Once installed, initialize Prisma by running
```
npx prisma init
```
* This will generate several files including a .env file (which contains a default postgres connection string that needs to be updated with the correct user, password, port, and database variables) and a prisma directory in the root directory which has a schema file where we will declare our models (similar to GraphQL)
    * Uses the prisma client js library and postgrest (but Prisma also supports MySQL and MongoDB)
    * The Url is the connection string which grabs the value from the first environment file it finds (here it's the .env in the root folder, but if there was a .dnv in the prisma folder, it would use that one)
* The Prisma schema file uses Prisma syntax

## Running Prisma Migrations
* After creating the models in the schema file, run the following command
```
npx prisma migrate dev
```
* This will generate the migrations in the prisma folder
    * The dev version of this command will delete the data, but there is another command that can be run for production to avoid this
* The migrate dev command automatically runs the generate command (npx prisma generate - which creates Typescript types for the schema and allows us to directly use those types in our code) and also pushes the migrations to the database (can view it in the docker logs for the db container)
* Prisma also provides a GUI, which can be initialized using
```
npx prisma studio
```

## Creating the Prisma Module
* We are going to encapsulate all thel ogic required to connect the database to the application in a Prisma model
```
nest g module prisma
```
* Service files also need to be generated, but just running nest g service prisma will automatically generate spec (test) files, which aren't needed, so add the --no-spec flag
```
nest g service prisma --no-spec
```
* This module and service will allow Prisma to connect to the database
    * The @Global() decorator and exporting the Prisma service in the Prisma module avoids having to import the Prisma module in the target module and services for each module you want to have access to the database - it would just be available to all the modules in the app (just make sure the global module is imported into the App module)

## DTOs
* Because Nest Js uses Express Js under the hood, you can access the Express request object directly, such as in @Req() req: Request - but directly accessing the request object is not best practice (because it's possible to change the underlying framework in the future, making the code non-reusable)
* DTOs are Data Transfer Objects - it's an object where you push your data (such as from a request) and you can run validation on it and can use the shape of those DTOs (because req.body for example is not descriptive of the data contained in the body)
* This tutorial uses the Barrel Export Pattern for DTOs, where the index.ts file re-exports specified exports from another file, which provides the main advantage of being able to import the dto folder itself, instead of including an import statement for each dto
* This enforces structure, but it doesn't provide validation (i.e. if a specified property is not part of the body, it gets assigned its default value)

## Pipes
* "A pipe is a class annotated with the @Injectable() decorator, which implements the PipeTransform interface. Pipes have two typical use cases:
    * transformation: transform input data to the desired form (e.g., from string to integer)
    * validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception"
* Pipes are functions that transform your data
    * For example, you can use built in pipes to transform specific data fields to be other data types, automatically throwing an error if the data cannot be transformed, such as in @Body('password', ParseIntPipe) password: string, which isolates the password property of the request body and attempts to convert the string datatype to an int datatype
* However, it becomes cumbersome to apply pipes to individual properties as they are received as arguments, so we can implement pipes directly in the DTO file instead (don't forget to set the .useGlobalPipes(new ValidationPipe()) property in main.ts)
* This tutorial uses class validators and class transformers to implement pipes, run the following command to install
```
npm i --save class-validator class-transformer
```