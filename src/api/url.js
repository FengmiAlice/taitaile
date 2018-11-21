let baseUrl = '';
switch (process.env.NODE_ENV) {
    case 'development':
        baseUrl = "http://test.ttljf.com:8080/ttl_chefHub";  //这里是本地的请求url
        // baseUrl = "http://192.168.41.212:8080";  //这里是本地的请求url

        break;
    case 'production':
        baseUrl = "http://test.ttljf.com:8080/ttl_chefHub" ;  //生产环境url
        break
}
export default baseUrl;