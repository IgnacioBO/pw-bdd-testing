import winston, {format} from "winston";
import path from 'node:path';
import fs from 'node:fs';

//Crear carpeta de logs si no existe
const logsDir = path.resolve(process.cwd(), 'logs');
fs.mkdirSync(logsDir, { recursive: true });

//GetCaller es una funcion que obtiene el archivo y linea de codigo desde donde se llamo al logger.
  function getCaller(): string {
    const err = new Error();
    Error.captureStackTrace(err, getCaller);

    const stack = err.stack?.split('\n').slice(1) ?? [];

    for (const rawLine of stack) {
      const line = rawLine.trim();

      if (
        line.includes('node:internal') ||
        line.includes(`${path.sep}node_modules${path.sep}`) ||
        line.includes(`${path.sep}logger.ts`) ||
        line.includes(`${path.sep}logger.js}`)
      ) {
        continue;
      }

      const match = line.match(/\(?(.+):(\d+):(\d+)\)?$/);
      if (match) {
        const filePath = match[1];
        const row = match[2];
        return `${path.basename(filePath)}:${row}`;
      }
    }

    return 'unknown:0';
  }

//addCaller llama a getCaller para obtener el archivo y linea, y se agrega a info.caller, para que luego en el formato del log se pueda mostrar esa informacion.
const addCaller = winston.format((info) => {
  info.caller = getCaller();
  return info;
});


//Formato de salida del log
const logPrintf = format.printf(info => 
  `[${info.level}] ${info.timestamp} [${info.caller}]: ${info.message} ${info.stack ? `\n${info.stack}` : ''}`
);

//Formatos basicos sin colores:
const baseFormat = winston.format.combine(
  addCaller(),
  //Dejar en mayusculas y asegurar que tengan 5 caracteres (por ejemplo INFO y ERROR quedan alineados)
  winston.format(info => {
    info.level = info.level.toUpperCase().padEnd(5, ' ');
    return info;
  })(),
  //Si hay error que imprima el stack trace completo, no solo el mensaje del error
  winston.format.errors({ stack: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), 
);


export const log = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    baseFormat,
    logPrintf
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error-file.log', level: 'error'}),
    new winston.transports.File({ filename: 'logs/log-file.log'}),
    new winston.transports.Console({
      level : 'debug',
      format: winston.format.combine(
        //baseFormat,
        winston.format.colorize(),
       logPrintf
      )
      
    }) 
  ],
});
