var userId = localStorage.getItem('userId')
if (userId)
{
	Lists = Meteor.subscribe('lists', userId)
	Folders = Meteor.subscribe('folders', userId)
	Tasks = Meteor.subscribe('tasks', userId)
}
else
{
	var anonUserId = localStorage.getItem('anonUserId')
	if (anonUserId)
	{
		Lists = Meteor.subscribe('lists', anonUserId)
		Folders = Meteor.subscribe('folders', anonUserId)
		Tasks = Meteor.subscribe('tasks', anonUserId)
	}
}

// UNIVERSAL (ON EVERY PAGE)
var setCurrPage = function(name, id) 
{ 
	Session.set('currPageName', name); 
	Session.set('currPageId', id) 
}
var getFolders = function(currParent) {return Folders.find({parent: currParent})}
var getLists = function(currParent) {return Lists.find({parent: currParent})}
var getTasks = function(currParent) {return Tasks.find({parent: currParent})}


Template.userAccounts.helpers
({
	'importAnonData': function()
	{ // double check Meteor.userId() (other check is in userAccounts html)
		var anonUserId = localStorage.getItem('anonUserId')
		var userId = Meteor.userId()
		if (userId && anonUserId)
		{
			Meteor.call('importAnonData', anonUserId)			
			// make sure no lists are unimported before deleting anonUserId
			if (!Lists.findOne({createdBy: anonUserId}) && !Folders.findOne({createdBy: anonUserId}))
			{
				localStorage.removeItem('anonUserId')
				localStorage.setItem('userId', userId) // could set this in an onLogin callback
			}
		}
	}
})

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

// FAB HELPERS -------------
Template.fabForFolder.helpers
({
	'getAction': function(action)
	{
		return Session.get(action)
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

// TO BE CHANGED TO LIST ACTIONS
Template.fabForList.helpers
({
	'addingTime': function() {return Session.get('addingTime')},
	'getAction': function(action)
	{
		return Session.get(action)
	},
	'placeHolder': function()
	{
		var primaryAction = Session.get('primaryActionL') 
		if (primaryAction == 'add')
			if ( Session.get('selectedTask') )
				return "Add Task Info"
			else
				return "New Task"
		else if (primaryAction == 'alarm_add')
			return "Add Alarm To Task"
	}
})


Template.navbar.helpers
({
	'currPage':function(){return Session.get('currPageName')},
	'parent': function()
	{
		var pageId = Session.get('currPageId')
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
	'isPrimaryAction': function(action)
	{
		var primaryAction = Session.get('primaryActionL')
		if (primaryAction == action)
			return true
	},
	'setCurrPage': function(){setCurrPage(this.name, this._id)},
	'task': function()
	{
		return getTasks(this._id)
	}
})
