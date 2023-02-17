"use strict";
const util = require("util");
const logger = require('../../aspect/logger/logger');
const operationalErrorDecider = require("./operationalErrorDecider");
module.exports = new errorHandler();

function errorHandler() {
    this.registerAndHandleAllErrors = function(app) {
        logger.debug(`Error handler now registers to handle all errors`);
        app.use((err, req, res, next) => {
            logger.debug(`Exception was caught by express middleware`);
            logger.debug(err.toString());
            this.logAndNotifyAboutError(err);
            res.status(err.httpCode).json(this.getFriendlyResponse(err));
            //since this error comes from an http request, we keep the process alive by taking a risky call that the error is probably operational
            next();
        });
        process.on("uncaughtException", error => {
            logger.debug(
                `Uncaught exception was caught with the following error ${
                    error.name
                    }: ${error.message}`
            );
            this.logAndNotifyAboutError(error);
            this.crashIfNotOperational(error);
        });

        process.on("unhandledRejection", (reason, p) => {
            logger.debug(
                `Unhandled rejection was caught for the following promise ${util.inspect(
                    p
                )}`
            );
            this.logAndNotifyAboutError(reason);
            this.crashIfNotOperational(reason);
        });
    };

    this.crashIfNotOperational = function(error) {
        if (!operationalErrorDecider.isOperationalError(error)) {
            logger.debug(
                `Error handler concluded that this error is not trusted thus exiting`
            );
            //process.exit(1);
        }
    };

    this.logAndNotifyAboutError = function(error) {
        if (!operationalErrorDecider.isOperationalError(error))
            logger.debug(
                "A non-trusted (not operational) error was detect, this will likely to kill the process - please analyze this issue and act thoughtfully"
            );

        logger.debug(`Error handler is reporting a new error: ${error}`);
    };

    this.getFriendlyResponse = function(error) {
        return { name: error.name, message: error.message }; //||error.message if comes as status code
    };
}
