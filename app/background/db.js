//Diz file handles db connection, inicialization, first file to run on the extension...
$(document).ready(function(){
	$('app').bind('start',function(){
		window.tabz = new Lawnchair('tabz',function(){
			console.log('DB ready to rock',this);
		}).all(function(r){
			if(r.length){
				$('app').trigger('dbConnection',{list:r});
				rIds = _.pluck(r, 'id');
				console.log('Tabz in db',r,rIds);
				chrome.windows.getAll({populate : true}, function(windows){
					var list = _.map(windows,function(window){ 
						return window.tabs
					});
					list = _.flatten(list);
					listIds = _.pluck(list, 'id');
					console.log('Actual Tabz',list,listIds);
				
					_.each(r,function(tab){
						if($.inArray(tab.id,listIds) === -1){
							tabz.remove(tab.id+'.0');
						}
						//console.log(tab,$.inArray(tab.id,listIds));
					})
					
					console.log('Does this case really happens?','Need function that goes throw list and finds tabz that arent in r, and add thems to db');
					_.each(list,function(tab){
						if($.inArray(tab.id,rIds) === -1){
							console.log('Add this tab',tab.title);
						}
					})
				});
				
			}else{
				console.log('No tabs in app');
				chrome.windows.getAll({populate : true}, function(windows){
					var list = _.map(windows,function(window){ 
						return window.tabs
					});
					list = _.flatten(list);
					console.log('Just fetched a list');
					_.each(list,function(tab){
						tab.key = tab.id
						tabz.save(tab);
					});
					$('app').trigger('dbConnection',{list:list});
				});
			}
		})
	
		console.log('App Starting');
	});
});
