var setCurrPage = function(name)
{ Session.set('currPage', name) }

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
	'folder': function(currParent)
	{
		return Folders.find({parent: currParent})
	},
	'list': function(currParent)
	{
		return Lists.find({parent: currParent})
	},
	'setCurrPage': function(){setCurrPage("todolyst")}
})

Template.list.helpers
({
	'setCurrPage': function(){setCurrPage(this.name)}
})

Template.folder.helpers
({
	'setCurrPage': function(){setCurrPage(this.name)}
})