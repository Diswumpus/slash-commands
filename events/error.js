const logger = require('../log');
process.on("unhandledRejection", (r) => {
    logger.log(`\`unhandledRejection\`\n\nReason: \`${r||"None"}\``, 'error')
})