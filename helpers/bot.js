'use strict';

const _ = require('lodash');
const cron = require('./cron');
const CronJob = require('cron').CronJob;

let job = new CronJob('*/1 * * * *', () => {
    cron.updateBoard().then(() => {
        console.log('Board updated');
    }, (error) => {
        console.error('Sorry we cant update the board');
    });
});

exports.startToWacth = () => {
    const Telegraf = require('telegraf');
    const bot = new Telegraf(process.env.BOT_TOKEN);

    bot.start((ctx) => {
        console.log('user use start command');
        ctx.reply('Welcome ' + ctx.from.first_name + '!, My name is HackathonBot, How can I help you?');

        ctx.reply('if you need help, please use the /help comamand');
    });

    bot.help((ctx) => {
        console.log('user use help command');
        ctx.reply('The available commands are:');
        ctx.reply('/start -> Allow you to start to talk with this bot');
        ctx.reply('/help -> Show this information');
        ctx.reply('/setup -> Allow you to change all configuration about this bot');
        ctx.reply('/update_board -> Allow you to update the trello board');
    });

    bot.command('github_setup', (ctx) => {
        ctx.reply('We going to configurate Github setting. Please use the /set_github_repo command and next to the parametrer');
    });

    bot.command('trello_setup', (ctx) => {
        ctx.reply('We going to configurate Trello setting. Please use the /set_trello_boardname command and next to the parametrer');
    });

    bot.command('setup', (ctx) => {
        console.log('user use setup command');

        ctx.reply('We going to start configurate Github, please use the /github_setup command');
    });

    bot.command('set_github_repo', (ctx) => {
        console.log('user use set_github_repo command');

        let param = ctx.message.text.replace('/set_github_repo ', '');

        if(param != null && param != ''){

            process.env['GITHUB_REPO'] = param.trim();
            ctx.reply('Github: Url repository updated, now use /set_github_username command');

        } else ctx.reply('Sorry we cant get the parameter, please try again this command.');
    });

    bot.command('set_github_username', (ctx) => {
        console.log('user use set_github_username command');
        let param = ctx.message.text.replace('/set_github_username ', '');

        if (param != null && param != '') {

            process.env['GITHUB_USERENAME'] = param.trim();
            ctx.reply('Github: Username updated, now use /set_github_hostname command');

        } else ctx.reply('Sorry we cant get the parameter, please try again this command.');
    });

    bot.command('set_github_hostname', (ctx) => {
        console.log('user use set_github_hostname command');
        let param = ctx.message.text.replace('/set_github_hostname ', '');

        if (param != null && param != '') {

            process.env['GITHUB_HOSTNAME'] = param.trim();
            ctx.reply('Github: Hostname updated, now use /set_github_clientid command');

        } else ctx.reply('Sorry we cant get the parameter, please try again this command.');
    });

    bot.command('set_github_clientid', (ctx) => {
        console.log('user use set_github_clientid command');
        let param = ctx.message.text.replace('/set_github_clientid ', '');

        if (param != null && param != '') {

            process.env['GITHUB_CLIENTID'] = param.trim();
            ctx.reply('Github: Client id updated, now use /set_github_clientsecret command');

        } else ctx.reply('Sorry we cant get the parameter, please try again this command.');
    });

    bot.command('set_github_clientsecret', (ctx) => {
        console.log('user use set_github_clientsecret command');
        let param = ctx.message.text.replace('/set_github_clientsecret ', '');

        if (param != null && param != '') {

            process.env['GITHUB_CLIENTSECRET'] = param.trim();
            ctx.reply('Github: Client secret updated, Congratulation you have configurated Github account.');
            ctx.reply('We going to start configurate Trello, please use the /trello_setup command');

        } else ctx.reply('Sorry we cant get the parameter, please try again this command.');
    });

    bot.command('set_trello_boardname', (ctx) => {
        console.log('user use set_trello_boardname command');
        let param = ctx.message.text.replace('/set_trello_boardname ', '');

        if (param != null && param != '') {

            process.env['TRELLO_BOARDNAME'] = param.trim();
            ctx.reply('Trello: Board name updated, now use /set_trello_apiurl command');

        } else ctx.reply('Sorry we cant get the parameter, please try again this command.');
    });

    bot.command('set_trello_apiurl', (ctx) => {
        console.log('user use set_trello_apiurl command');
        let param = ctx.message.text.replace('/set_trello_apiurl ', '');

        if (param != null && param != '') {

            process.env['TRELLO_APIURL'] = param.trim();
            ctx.reply('Trello: API url updated, now use /set_trello_apikey command');

        } else ctx.reply('Sorry we cant get the parameter, please try again this command.');
    });

    bot.command('set_trello_apikey', (ctx) => {
        console.log('user use set_trello_apikey command');
        let param = ctx.message.text.replace('/set_trello_apikey ', '');

        if (param != null && param != '') {

            process.env['TRELLO_APIKEY'] = param.trim();
            ctx.reply('Trello: API key updated, now use /set_trello_token command');

        } else ctx.reply('Sorry we cant get the parameter, please try again this command.');
    });

    bot.command('set_trello_token', (ctx) => {
        console.log('user use set_trello_token command');
        let param = ctx.message.text.replace('/set_trello_token ', '');

        if (param != null && param != '') {

            process.env['TRELLO_TOKEN'] = param.trim();
            ctx.reply('Trello: API token updated, Congratulation you have configurated Trello account.');
            ctx.reply('Wait, setting...');

            console.log('process.env', process.env);

            cron.updateBoard().then(() => {
                ctx.reply('Board updated');
            }, (error) => {
                ctx.reply('Sorry we cant update the board');
                console.error('Sorry we cant update the board', error);
            });

            ctx.reply('Finished. Now you can syncronize you board with /update_board command whatever you want');

            job.start();

        } else ctx.reply('Sorry we cant get the parameter, please try again this command.');
    });

    bot.command('update_board', (ctx) => {
        console.log('user use updateBoard command');

        let arr = ['GITHUB_REPO', 'GITHUB_USERENAME', 'GITHUB_HOSTNAME', 'GITHUB_CLIENTID', 'GITHUB_CLIENTSECRET', 'TRELLO_BOARDNAME', 'TRELLO_APIURL', 'TRELLO_APIKEY', 'TRELLO_TOKEN' ];
        let sw = false;

        _.forEach(arr, (item) => {
            if (!process.env[item] || process.env[item] == ''){
                sw = true;
            }
        });

        if (sw) return ctx.reply('Sorry, some parameters are not defined yet, please use /setup command first');

        cron.updateBoard().then(() => {
            ctx.reply('Board updated');
        }, (error) => {
            ctx.reply('Sorry we cant update the board');
            console.error('Sorry we cant update the board', error);
        });

    });

    bot.hears('hi', (ctx) => {
        ctx.reply('Hi ' + ctx.from.first_name + ', How can I help you?');
    });

    bot.hears('bye', (ctx) => ctx.reply('Bye, it was a pleasure to attend you, ' + ctx.from.first_name + '!'));

    bot.startPolling();
};