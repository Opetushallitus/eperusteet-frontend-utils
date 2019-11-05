import axios from 'axios';


axios.defaults.headers.common['Caller-Id'] = '1.2.246.562.10.00000000001.eperusteet';


export function axiosHandler(msg: string) {
  return async (err: any) => {
    logger.error(msg as any, err);
    throw err;
  };
}

