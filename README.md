# FindFunc

FindFunc is a DSL that generates IDEF0-Like diagram and metric of IDEF0 building blocks.

This project-based learning program is funded by the School of Information Technology, King Mongkut's University of Technology Thonburi - [visit SIT research group](https://www.sit.kmutt.ac.th/sit-research/).

You will have to install the following software on your computer

- [Ruby v2.6+](https://www.ruby-lang.org/en/downloads/)
- [Node.js v12.14+ Npm v6.14+](https://nodejs.org/en/download/)
- [Java v1.8+](https://www.oracle.com/java/technologies/javase-jre8-downloads.html)

# Install and Run example projects

```
git clone git@github.com:vorachet/FindFuncDSL.git

cd FindFuncDSL

npm install

npm start
```

FindFuncDSL provides a convenient feature that runs the DSL compiler along with the built-in HTTP server to monitor your DSL files for any changes and generation tasks.

If the server can be started successfully, the browser will automatically launch in this step.

![image](images/index.png)

![image](images/MaintainReparableSpares_index.png)

![image](images/MaintainReparableSpares_idef0.png)

![image](images/MaintainReparableSpares_metric.png)

![image](images/Pizza_idef0.png)

![image](images/ProjectStages_idef0.png)

![image](images/SweKernel_idef0.png)

# The workflow

## Start the server

```
npm start
```

## Create your FindFuncDSL project

In order to work on multiple FindFuncDSL projects, save your DSL files in `projects` folder.

### Simplified structure of FindFuncDSL

The reserved words that cannot be used as an {identifier}

- idef0
- concepts
- func
- view
- title

```
idef0 ProjectName
concepts
	InputConcept  OutputConcept
	ResourceConcept  FinalOutputConcept

func Function1 (
	receives InputConcept
	produces OutputConcept
	requires ResourceConcept
)

func Function2 (
	produces FinalOutputConcept
	respects OutoutConcept
)

view View1 title "My View1" funcs (Function1 Function2)

view View2 title "My View2" funcs (Function1)

view View3 title "My View3" funcs (Function2)

```

Example DSL files

- [MaintainReparableSpares.idef0](projects/MaintainReparableSpares.idef0)
- [Pizza.idef0](projects/Pizza.idef0)
- [ProjectPlan.idef0](projects/ProjectPlan.idef0)
- [SweKernel.idef0](projects/SweKernel.idef0)

## See the generated artifacts in real-time

# Development notes

## Abstract syntax

- [Abstact syntax text](docs/grammar.txt)
- [Abstact syntax image](images/syntax.png)

## Concrete syntax examples (the DSL)

- [MaintainReparableSpares.idef0](projects/MaintainReparableSpares.idef0)
- [Pizza.idef0](projects/Pizza.idef0)
- [ProjectPlan.idef0](projects/ProjectPlan.idef0)
- [SweKernel.idef0](projects/SweKernel.idef0)

## Software building blocks

- [Textual DSL development framework - (Eclipse Xtext)](https://www.eclipse.org/Xtext/)
- [HTTP server with live reload capability - (tapio/live-server)](https://github.com/tapio/live-server)
- [Node.js fs.watch wrapper - (paulmillr/chokidar)](https://github.com/paulmillr/chokidar)
- [IDEF0 diagarm generation - (jimmyjazz/IDEF0-SVG)](https://github.com/jimmyjazz/IDEF0-SVG)
- [UI framework - SemanticUI](https://semantic-ui.com/)

## Maintainer

- Vorachet Jaroensawas (vorachet@gmail.com)
