
// UNIVERSAL (ON EVERY PAGE)
var setCurrPage = function(name, id) 
{ 
	Session.set('currPageName', name); 
	Session.set('currPageId', id) 
}
var getFolders = function(currParent) {return Folders.find({parent: currParent})}
var getLists = function(currParent) {return Lists.find({parent: currParent})}

Template.folder.helpers
({
	'folder': function()
	{
		return getFolders(this._id)
	},
	'list': function()
	{
		return getLists(this._id)
	},
	'setCurrPage': function(){setCurrPage(this.name, this._id)}
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
	'currPage':function(){return Session.get('currPage')},
	'parent': function()
	{
		var pageId = Session.get('currPageId')
		console.log('inside parent ' + Session.get('currPageId') )
		var currList = Lists.findOne({_id: pageId })
		var currFolder = Folders.findOne({_id: pageId })

		if (currList)
			return Folders.findOne({_id: currList.parent})._id
		else if (currFolder)
			return Folders.findOne({_id: currFolder.parent})._id
		else
			return false
	}
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
	'setCurrPage': function(){setCurrPage(this.name, this._id)}
})
