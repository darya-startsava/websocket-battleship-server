import { httpServer } from './src/http_server/index';
import './src/ws_server/index';
import { WS_PORT } from './src/constants';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
console.log(`WebSocketServer works on port ${WS_PORT}.`);
httpServer.listen(HTTP_PORT);
