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
Docker
```
### Installing

- Install NodeJS
- (Optional) Install Webstorm
- (Optional) Install latest version of docker (current ver.4.26.1)
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
    - Webstorm IDE
        ```
           Edit configuraiton -> main.py
        ```
    - CMD
        ```
            npm start
        ```
    - Docker 
        ```
            Follow docker deployement instructions below
        ```

### Testing
 - WIP 

## Deployment Docker Local
    - Prerequisites
        ```
        Docker
        ```
    - Clone latest branch: 'dev'
    - Start docker of all modules using the docker compose file found in project location 'data-analytics-and-visualisation-frontend/docker/' 
        ```
        docker compose up -d --build 
        ```
## Deployment Docker Simavi Server
    - Prerequisites
        ```
        Docker
        ```
    - Clone latest branch: 'prod_new'
    - Start docker of all modules using the docker compose file found in project location 'data-analytics-and-visualisation-frontend/docker/

<!-- ## Deployment (Kubernetes) WIP
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
-->
## Built With
[React](https://react.dev/)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning
Not currently following any including semver - will try to follow it.
<!--  We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](tags). --> 

## Authors

* **George Doukas** - *Dev* - [gd180](https://github.com/gd180)
* **Michael Kontoulis** - *Dev* - [Mikailo](https://github.com/Mikailo)
* **Loukas Ilias** - *Dev* - [loukasilias](https://github.com/loukasilias)
* **Theodoros Pountisis** - *Dev* - [Mikailo](https://github.com/theopnt)
* **George Ladikos** - *Dev* - [Mikailo](https://github.com/georgeladikos)
* **Christodoulos Santorinaios** - *Former Dev* - [csantor](https://github.com/csantor)

See also the list of [contributors](contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
