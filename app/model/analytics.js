module.exports  =  { 
    serviceAccount : '12979738412-vhqum3e1ehsm0au8ijj1e1025kpd59s0@developer.gserviceaccount.com',
    keyPath 	   : './ga-key.pem',
    scope		   : ['https://www.googleapis.com/auth/analytics.readonly'],
    query		   : 'https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A102767334&start-date=30daysAgo&end-date=today&metrics=ga%3AuniquePageviews&dimensions=ga%3ApagePath&sort=-ga%3AuniquePageviews&filters=ga%3ApagePath%3D%40legislacion&max-results=5&access_token=',

// FUNCTIONS
// =============================================================================
	formatMostVisited : function(rows,existConfig){
		var out = [];

		for(i=0; i<rows.length; i++){
			var number = rows[i][0].replace(/.*\/(.*)$/,'$1');
			out.push(number);
		}

		return out;
	}
};

