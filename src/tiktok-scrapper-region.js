import axios from 'axios';
import { load } from 'cheerio';

const getUserRegion = async (username) => {
  try {
    const url = `https://www.tiktok.com/@${username}`;
    const response = await axios.get(url);
    const html = response.data;

    const $ = load(html);
    const userModuleScript = $('script:contains("UserModule")').html();

    if (!userModuleScript) {
      console.log('No se encontró el script UserModule');
      return null;
    }

    const region = extractRegion(userModuleScript);
    
    if (!region) {
      console.log('No se encontró la región en el script UserModule');
      return null;
    }

    return region;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return null;
  }
};

const extractRegion = (userModuleScript) => {
  const regionPattern = /"region":"(.*?)"/g;
  const regionMatches = userModuleScript.match(regionPattern);

  if (!regionMatches || regionMatches.length < 2) {
    return null;
  }

  return regionMatches[1].match(/"region":"(.*?)"/)[1];
};

export {
  getUserRegion
};
