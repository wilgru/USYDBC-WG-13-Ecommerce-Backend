# USYDBC-WG-13-Ecommerce-Backend
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

An e-commerce backend thhat makes use of APIs to get, update, create, and delete data from the corresponding databases. 

## Table of Contents
 
[Installation](#Installation)   
[Usage](#Usage)   
[Demonstration](#Demonstration)  
[License](#License)    

<a name="Installation"></a>
## Installation

Install using git clone SSH:

```bash
git clone git@github.com:wilgru/USYDBC-WG-13-Ecommerce-Backend.git
```

<a name="Usage"></a>
## Usage

Fist you need to set up the database. You can do this by using the schema.sql file found under /db. To do this run the following command in your Mysql shell:

```bash
SOURCE db/schema.db
```

Next is to seed the database. To seed the data base, run the following script:

```bash
npm run seed
```

This will give you some data to work with.

Now use the following command in your terminal to start your local server:

```bash
npm start
```

make sure you have all dependencies installed and have created your own local .env file to store your sql password and database.

Once that is running, you can use a program like Insomnia to make calls to the ecommerce API.

<a name="Demonstration"></a>
## Demonstration

You can watch a demo of how to use the Ecommerce Backend [here](https://drive.google.com/file/d/1gfxpNGyqjZV-zxyJHhJ3N7Nlo2BHTzI-/view?usp=sharing).

<a name="License"></a>
## License

&copy; William Gruszka

Licensed under the [MIT License](./LICENSE.txt)

