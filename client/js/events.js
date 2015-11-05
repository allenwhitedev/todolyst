Meteor.startup(function()
{ // set session/localStorage variables to defaults if not set (3 cases below)
	if ( !Session.get('primaryAction') )
	{
		// folder fab
		Session.set('primaryAction', 'mode_edit')
		Session.set('secondaryAction', 'folder')
		Session.set('tertiaryAction', 'add_alert')
		Session.set('quaternaryAction', 'note_add')
		// list fab
		Session.set('primaryActionL', 'add')
		Session.set('secondaryActionL', 'alarm_add')
		Session.set('tertiaryActionL', 'check')
		Session.set('quaternaryActionL', 'open_with')						
	}
	if ( !Session.get('currPage') )
		Session.set('currPage', 'todolyst')
	if ( !localStorage.getItem('userId') && !localStorage.getItem('anonUserId') )
	{
		var anonUserId = Random.id()
		localStorage.setItem('anonUserId', anonUserId)
		Folders.insert({name: 'rootFolder', root: true, createdBy: anonUserId})
	}
})


Template.navbar.events
({
	'click .nav-wrapper > ul > li': function(){ $('.button-collapse').sideNav('hide') }
})


// FIXED ACTION BUTTON ----------------------

// FAB-FOLDER EVENTS
Template.fabForFolder.events
({
	'click .fixed-action-btn > ul > li > a': function(event)
	{
		var oldPrimaryAction = Session.get('primaryAction')
		var newPrimaryAction = Session.get(event.target.id)
		Session.set('primaryAction', newPrimaryAction)
		Session.set(event.target.id, oldPrimaryAction)
	},
	'submit .fabForm': function(event)
	{
		event.preventDefault()
		var fabText = event.target.fabText.value
		var primaryAction = Session.get('primaryAction')
		var userId = localStorage.getItem('userId')
		
		if (!userId) // if no userId is found, set userId to be anonUserId
			userId = localStorage.getItem('anonUserId')
		
		if (fabText.length > 0) // if bar has text, insert and clear form
		{
			if (primaryAction == "note_add")
				Lists.insert({createdBy: userId, name: fabText, parent: Session.get('currPageId')})
			else if (primaryAction == "folder")
				Folders.insert({createdBy: userId, name: fabText, parent: Session.get('currPageId')})
			event.target.fabText.value = ""
		} 
	}
})

// FAB-LIST EVENTS
Template.fabForList.events
({
	'click .fixed-action-btn > ul > li > a': function(event)
	{
		var oldPrimaryAction = Session.get('primaryActionL')
		var newPrimaryAction = Session.get(event.target.id)
		Session.set('primaryActionL', newPrimaryAction)
		Session.set(event.target.id, oldPrimaryAction)
	},
	'submit .fabForm': function(event)
	{
		event.preventDefault()
		var fabText = event.target.fabText.value
		var primaryAction = Session.get('primaryActionL')
		var userId = localStorage.getItem('userId')
		
		if (!userId) // if no userId is found, set userId to be anonUserId
			userId = localStorage.getItem('anonUserId')
		
		if (fabText.length > 0) // if bar has text, insert and clear form
		{
			if (primaryAction == "add")
				Tasks.insert({createdBy: userId, name: fabText, parent: Session.get('currPageId')})


			event.target.fabText.value = ""
		} 
	}
})
