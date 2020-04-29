# FindFunc

FindFunc is a DSL that generates IDEF0-Like diagram and metric of IDEF0 building blocks.

This project-based learning program is funded by the School of Information Technology, King Mongkut's University of Technology Thonburi - [visit SIT research group](https://www.sit.kmutt.ac.th/sit-research/).

# Install and Run

```
git clone git@github.com:vorachet/FindFuncDSL.git

cd FindFuncDSL

npm install

npm start

```

FindFuncDSL provides a convenient feature that runs the DSL compiler along with the built-in HTTP server to monitor your DSL files for any changes and generation tasks.

If the server can be started successfully, the browser will automatically launch in this step.

![image](images/index.png)

# Modeling functions using FindFuncDSL to generate IDEF0-Like diagram and metric of IDEF0 building blocks

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
