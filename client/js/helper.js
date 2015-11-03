
// UNIVERSAL (ON EVERY PAGE)
var setCurrPage = function(name) { Session.set('currPage', name) }
var getFolders = function(currParent) {return Folders.find({parent: currParent})}
var getLists = function(currParent) {return Lists.find({parent: currParent})}

Template.folder.helpers
({
	'folder': function()
	{
		return getFolders( Session.get('currPage') )
	},
	'list': function()
	{
		return getLists( Session.get('currPage') )
	}
})

Template.fab.helpers
({
	'getAction': function(action)
	{
		return Session.get(action)
	},
	'textBar':function()
	{
		if (Session.get('primaryAction' == 'folder' || 'note_add'))
			return true
	},
	'placeHolder': function()
	{
		var primaryAction = Session.get('primaryAction') 
		if (primaryAction == 'folder')
			return "New Category"
		else if (primaryAction == 'note_add')
			return "New Lyst"
	}

})

Template.navbar.helpers
({
	'currPage':function(){return Session.get('currPage')}
})

Template.home.helpers
({
	'rootFolder': function()
	{
		rootFolder = Folders.findOne({root: true})
		console.log(rootFolder)
		if (rootFolder)
			return rootFolder._id
		else
			return false
	}
})

Template.list.helpers
({
	'setCurrPage': function(){setCurrPage(this.name)}
})

Template.folder.helpers
({
	'setCurrPage': function(){setCurrPage(this.name)}
})