# WeddingInfo
An Angular frontend and dotnet-core backend for hosting wedding information.

# Getting Started
You will need to have [dotnet core sdk](https://www.microsoft.com/net/download) and [Angular 7](https://angular.io/guide/quickstart) installed on your machine to debug this application.

This application uses S3 to store images so you will need your AWS AccessKey and SecretKey.  There is an option to fake S3 uploading so you could keep that as an option, but not recommended.  This option is to test your code and not be charged for it :).

The database technology used on this project is MySQL.  This can easily be changed to use AWS Aurora to keep costs much lower (or you can use Heroku).

## Note
I have deployed the backend using Heroku and would like any guidence on this project to use AWS Lambdas to make it a better option.

## Configurations
You will need to modify the configuration files in both the frontend and backend.
### Frontend Configuration
Update the rc/app/config/HttpConfig.ts file to point to the proper ip address for the backend:
```typescript
public static readonly BASE_URL: string = "http://localhost:5000";
```
### Backend Configuration
There are a total of 3 configuration files that will need to be edited:
#### API Configuration Files
There are three configuration files for the API and each are for build configurations (WeddingInfo.API\appSettings.json):
```json
"ConnectionStrings": {
    "JasonSarahContext": "<Connection String to your MySQL Database>"

  },
  "AWSCredentials": {
    "FakeS3": false,
    "Bucket": "wedding-info",
    "AssetPath": "home_images/",
    "UploadPath": "uploads/",
    "AccessKey": "<AWS AccessKey>",
    "SecretKey": "<AWS SecretKey>"
  },
  "TokenAuthentication": {
    "SecretKey": "<AES Encryption Key (don't use anything too simple here!)",
    "Issuer": "<Issuer>",
    "Audience": "<Audience>",
    "TokenPath": "/api/token",
    "CookieName": "access_token"
  }
```
You will want to edit each environment variable accordingly.

# Backend Tech Stack
The backend is written in dotnet-core 2.1 and is seperated out into two projects:
## WeddingInfo.API
This is the Web API Application which uses JWT as the middleware.  The use of [Automapper](https://automapper.org/), [Mediatr](https://github.com/jbogard/MediatR), and [EF Core](https://docs.microsoft.com/en-us/ef/core/) with [Pomelo EF Core MySQL](https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql) keeps this solution very simple to maintain.
## WeddingInfo.Domain
This is where the Entities, DTOs, Mapping, and MediatR implementation exists.  The database Migrations also exist in this solution and references appsettings.json to get the connection string information.

# Frontend Tech Stack
The frontend application is written in Angular 7.  You can reference the package.json to see which additional npm packages are used.

# Getting Started
## Run and Compile the Backend
There are numerous ways to run dotnet core and the simpliest is to use Visual Studio Community but you can also just use the CLI (which I will describe here).
1. Open your terminal/bash/etc to the WeddingInfo.API location.
2. dotnet restore
3. dotnet run

## Deploying the Backend
There is a very simple dockerfile that will need to be copied into the publish folder after running dotnet publish -c Release.  This is to help with deploying to the cloud.

## Run and Compile the Frontend
Since this is using Angular, the use of the cli is useful:
1. Open your terminal/bash/etc to the WeddingInfo.Frontend location.
2. npm install
3. npm start

## Deploying the Frontend
I highly recommend using S3 to statically host the frontend since it is a very cheap option.  There are many references on the internet to accomplish this.
All you need to do in your application before moving it to whatever host you want, you will want to modify the HttpConfig.ts to point to where the deployed version of the backend resides.  Afterwards, just call ng build --prod --aot.
