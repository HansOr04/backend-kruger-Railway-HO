import winston from "winston";
import "winston-daily-rotate-file";
const logFormat = winston.format.printf(({level,message,timestamp})=>{
    return `${timestamp}[${level.toUpperCase()}]: ${message}`;
});
//? Vamos a crear nuestro logger 
//! Para esto tenemos que definir un transporte
const customLevelOptions ={
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        silly: 5,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        verbose: "cyan",
        debug: "blue",
        silly: "magenta",
    },
}

const fileTransport = new winston.transports.DailyRotateFile({
    dirname:"./logs",
    filename:"aplication-%DATE%.log",
    datePattern:"YYYY-MM-DD-HH-mm",
    //?Se va a comprimir el archivo
    zippedArchive: true,
    //? Vamos a definir el size de los archivos
    maxSize: "1m",
    //? Vamos a definir el numero maximo de archivos que debemos tener disponibles, una vez que lleguemos a este numero
    //?automaticamente los archivos mas antiguos viejos se van a eliminar
    maxFiles: 3,
    //!Vamos a definir la frecuencia en tiempo que queremos segmentar nuestros logs
    //?En este caso vamos a hacerlo cada 24 horas
    frequency: '24H',
    //?Vamos a registrar nuestro nivel
    level: "debug",
});
const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp(
            {format:"YYYY-MM-DD HH:mm:ss"}
        ),
        logFormat
    ),
    transports: [
        new winston.transports.Console(
            {
                level: "silly",
                format: winston.format.combine(
                    winston.format.colorize(
                        {all:true,
                        colors: customLevelOptions.colors,
                        }
                    ),
                    
                )
            }
        )
        ,fileTransport
    ],

});
//?Como registrar los eventos en consola
//! logger.info("Hello");
//! logger.warn("Hello");
//! logger.error("Hello");
//! logger.verbose("Hello");
//! logger.debug("Hello");
//! logger.silly("Hello");

export default logger;