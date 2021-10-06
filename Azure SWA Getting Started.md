# Getting started with Azure Static Web App and Azure functions

The boilerplate of this app is created by following the steps in the following YouTube video:\
[Dynamic websites with Azure Static Web Apps](https://youtu.be/LHpxrAR8dHA?t=8m29s)

The bolerplate code can be [found here](https://github.com/GeekTrainer/aswa-starter/tree/html)

Steps:
1. [8m29s](https://youtu.be/LHpxrAR8dHA?t=8m29s): Create/download a local boilerplate
    - Create a boilerplate `index.html` and a `local-index.js` page which has the basic layout and data for your app
    - This helps ensure that you have a working example without any API reuired
    - Add this boilerplate code to GitHub 
2. [12m2s](https://youtu.be/LHpxrAR8dHA?t=12m2s): Create Static Web App from scratch
    - Go to Azure > Search for "Static Web App"
    - Create a new "Static Web App" 
    - Sign-in to GitHub and link a repository to the SWA
        - This will help you create a yaml file to set-up CI/CD in the next steps
    - Configure the settings based don your development requirement
    - Click Create
3. [15m6s](https://youtu.be/LHpxrAR8dHA?t=15m6s): Review the app created in Azure and GitHub
    - A yml file will be created to automatically deploy and publish your website
    - A random generated url is assigned to your SWA. You have the abiility to add a **Custom domain**
4. [17m14s](https://youtu.be/LHpxrAR8dHA?t=17m14s): **Azure Functions** Set-up
    - Create a new folder called `api` in the root of your project
    - Install "[Azure functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)" for Visual Studio code (if not already installed)
    - Create a new Azure functions project 
        - Click on the Azure function extension in the "Activity Bar" and click the "Create new" button
        - VS Code will prompt you to choose your preferred language. Choose your preferred language (this app uses JavaScript)
        - Next you need to choose a template for your first function. Choose 'HTTP trigger' and give the function a name (my name is GitHub_Calendar)
        - Next choose the Authorization level as require. This app is Anonymous to allow everyone to access it.
5. [19m33s](https://youtu.be/LHpxrAR8dHA?t=19m33s): Adding server side code and API integration
    - once the project is created, VS Code will show you a default Azure function that's created for you. You can have a look at it to understand the basic functionality.
    - Next copy the code from `local-index.js` from the bolerplate repo mentioned above to the active file - `index.js` in the api folder
    - commit the code to GiHub to a new branch - make sure to add to a new branch which will be merged later
    - Check if the server code you added is working fine
        - host/run the server for api from the api directory using `func host start`
        - open the link to check if the expected output is being provided by the api
6. [26m00s](https://youtu.be/LHpxrAR8dHA?t=26m00s): Deploying Azure Function
    - Create a Pull Request and merged the new branch to main branch
    - This will trigger the yml file to automatically deploy your code to Azure functions