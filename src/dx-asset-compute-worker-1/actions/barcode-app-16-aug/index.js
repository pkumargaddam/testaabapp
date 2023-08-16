const { Core } = require('@adobe/aio-sdk');
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils');
const bwipjs = require('bwip-js');

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action');

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = ['value'];
    const errorMessage = checkMissingRequestInputs(params, requiredParams);
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }
  
    const buffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: params.value,
      scale: 3,
      height: 10,
      includetext: false,
      backgroundcolor: 'ffffff'
    });
    
    return {
      headers: { 'Content-Type': 'image/png' },
      statusCode: 200,
      body: buffer.toString('base64')
    };
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, error.message, logger);
  }
}

exports.main = main;

