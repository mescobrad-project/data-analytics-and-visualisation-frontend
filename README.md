# MES-CoBraD Analytics and Visualisation Frontned Module

![REPO-TYPE](https://img.shields.io/badge/repo--type-frontend-green?style=for-the-badge&logo=github)

This is the frontend of the MES-CoBraD Data Analytics and Visualisation Module

## Getting  Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
```
Nodejs - 16.14.2
```
#### Optional but recommended
```
Webstorm IDE
```
### Installing

- Install NodeJS
- (Optional) Install Webstorm
- Clone this repository
  - Webstorm IDE 
    ```
    - Get from VCS
    - Github
    - Select this repository
    ```
  - cmd
    ```
    git clone https://github.com/mescobrad-project/data-analytics-and-visualisation-frontend.git
    ```
- Install dependencies
    ```
    npm install 
    ```

### Running 
```
npm start
```

## Running the tests (WIP)
```
npm test
```
### Break down into end to end tests (WIP)
```
WIP
```

### And coding style tests (WIP)
```
WIP
```

## Deployment (WIP)
WIP
```
npm run build
```

## Deployment (Kubernetes) WIP
    - Prerequisites
        ```
        Kuberenetes : Recommended enable through docker desktop
        ```
    - kubectl create -f .\analytics-frontend-service.yaml
    - kubectl create -f .\analytics-frontend-deployment.yaml

    - Misc 
        ```
        kubectl get services -o wide
        kubectl get pods -o wide
        kubectl get nodes -o wide
        kubectl describe services
        kubectl describe services/analytics-frontend
        
        To stop the nodes:
        kubectl get deployments
        kubectl delete deployment analytics-frontend
        

        To clear:  kubectl delete all --all --namespace default 

        To see logs, can be done through docker-desktop
        ```

## Built With
WIP 

[//]: # ()
[//]: # (* [SpringBoot]&#40;http://springboot.io&#41; - The Java framework used)

[//]: # (* [Maven]&#40;https://maven.apache.org/&#41; - Dependency Management)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](tags). 

## Authors

* **George Doukas** - *Role* - [gd180](https://github.com/gd180)
* **Loukas Ilias** - *Role* - [loukasilias](https://github.com/loukasilias)
* **Michael Kontoulis** - *Role* - [Mikailo](https://github.com/Mikailo)
* **Christodoulos Santorinaios** - *Role* - [csantor](https://github.com/csantor)

See also the list of [contributors](contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
