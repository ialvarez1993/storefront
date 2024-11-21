import axios from "axios";

const options = {
  method: 'GET',
  url: 'http://localhost:1337/api/acerca-de',
  params: { 'pagination[withCount]': 'true' },
  headers: {
    'User-Agent': 'insomnia/10.1.1',
    Authorization: 'Bearer 17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86'
  }
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
