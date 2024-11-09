import logger from "../utils/logger.js";

const testLogs = async (req, res) => {
    try {
        logger.error("Este es un error");
        logger.warn("Este es un warn");
        logger.info("Este es un info");
        logger.verbose("Este es un verbose");
        logger.debug("Este es un debug");
        logger.silly("Este es un silly");

        res.status(200).send({ message: "Logs enviados" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

};
export { testLogs }