var proxy 	    = require('http-proxy');
var serverProxy = proxy.createProxyServer();
var rootExist   = "http://sparl-desa.hcdn.gob.ar:8080/exist/rest/db/digesto/xql";
var methodURL   =  {
    search       : function () { return '/search.xql'; },
    searchIndex : function () { return '/search-index.xql'; }
};

module.exports  =  { 
    search : function(req, res){
    	serverProxy.web(req, res, { target: rootExist + methodURL.search() });
    },
    searchIndex : function(req, res){
    	serverProxy.web(req, res, { target: rootExist + methodURL.searchIndex() });
    }
};
