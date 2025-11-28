#!/usr/bin/env node

const axios = require("axios");
const chalk = require("chalk");
const { Command } = require("commander");
require("dotenv").config();

const program = new Command();

program
    .name("Weather CLI")
    .description("A simple command-line-interface to check weather of any location")
    .version("1.0.0")

program.command("check")
    .description("Get weather info of any location")
    .argument("<location>","enter the location")
    .action(async (location)=>{
        const location_response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${process.env.API_KEY}`);
        const latitude = location_response.data[0].lat;
        const longitude = location_response.data[0].lon;
        const country = location_response.data[0].country;

        const weather_response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`);
        const temperature = weather_response.data.main.temp - 273;
        const psuedo_temperature = weather_response.data.main.feels_like - 273;
        const condition = weather_response.data.weather[0].description;
        const humidity = weather_response.data.main.humidity;

        const aqi_response = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`);
        const aqi = aqi_response.data.list[0].main.aqi;
        const pm2_5 = aqi_response.data.list[0].components.pm2_5;

        console.log(chalk.bold.yellow(`\n ⟟ ${location}, ${country}`));
        console.log(` ----------------------------------------`);
        console.log(chalk.cyan(` Temperature`)+chalk.green(`  : ${Math.round(temperature)}°C (feels like ${Math.round(psuedo_temperature)}°C)`));
        console.log(chalk.cyan(` Humidity`)+chalk.green(`     : ${humidity}%`));
        console.log(chalk.cyan(` Condition`)+chalk.green(`    : ${condition}`));
        if (aqi == 1) console.log(chalk.cyan(` Air Quality`)+chalk.green(` : Good (pm2.5:- ${pm2_5})`));
        else if (aqi == 2) console.log(chalk.cyan(` Air Quality`)+chalk.green(`  : Fair (pm2.5:- ${pm2_5})`));
        else if (aqi == 3) console.log(chalk.cyan(` Air Quality`)+chalk.green(`  : Moderate (pm2.5:- ${pm2_5})`));
        else if (aqi == 4) {
            console.log(chalk.cyan(` Air Quality`)+chalk.green(`  : Poor (pm2.5:- ${pm2_5})`));
            console.log(` ----------------------------------------`);
            console.log(` `+chalk.white.bgRed(`Recommendation: Start wearing a mask.`));
        }
        else {
            console.log(chalk.cyan(` Air Quality`)+chalk.green(`  : Very Poor (pm2.5:- ${pm2_5})`));
            console.log(` ----------------------------------------`);
            console.log(` `+chalk.white.bgRed(`Recommendation: Start wearing a mask.`));
        }
    })

program.parse();