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
		Session.set('quinaryActionL', 'playlist_add')						
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

// materialize jquery intializations
 Template.datepicker.rendered = function()
 {	
  $('.datepicker').pickadate
  ({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 5 // Creates a dropdown of 15 years to control year
  })
  //$('.datepicker').focus()
 // Meteor.setTimeout(function(){ $('.datepicker').focus() }, 500)
  
 }

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
		// clear selected task from add task info when switching primaryAction
		var selectedTask = Session.get('selectedTask')
		if (selectedTask)
		{
			$("#" + selectedTask).removeClass('selectedTask')
			Session.delete('selectedTask')
		}
		// switch primaryAction
		var oldPrimaryAction = Session.get('primaryActionL')
		var newPrimaryAction = Session.get(event.target.id)
		Session.set('primaryActionL', newPrimaryAction)
		Session.set(event.target.id, oldPrimaryAction)
		
		if (oldPrimaryAction == 'alarm_add') Session.delete('addingTime')
		if (newPrimaryAction == 'alarm_add') Session.set('addingTime', true)
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
			
			else if (primaryAction == "playlist_add")
				var selectedTask = Session.get('selectedTask')
				// make sure users only add task info for their own tasks
				if (Tasks.findOne({_id: selectedTask, createdBy: userId}))
				{
					Tasks.update({_id: selectedTask}, {$set: {info: fabText} } )
					// TBA: effect to selectedTask (will be re-rendered first) to indiciate info has been added to the task
					$("#" + selectedTask).removeClass('selectedTask')
					Session.delete('selectedTask')
				} 
				
			event.target.fabText.value = ""
		} 
	}
})

Template.list.events
({
	'click .collection-item': function(event)
	{
		var primaryAction = Session.get('primaryActionL')
		if (primaryAction == "playlist_add" || "alarm_add")
		{
			var selectedTask = Session.get('selectedTask')
			$("#" + selectedTask).removeClass('selectedTask')
			Session.set('selectedTask', event.target.id)
			$("#" + event.target.id).addClass('selectedTask')
		}
		if (primaryAction == 'alarm_add')
			Meteor.setTimeout(function(){ $('.datepicker').focus() }, 200)
	}
})
