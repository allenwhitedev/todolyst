// EVENTS

Template.navbar.events
({
	'click .nav-wrapper > ul > li': function(){ $('.button-collapse').sideNav('hide') }
})

// ---------------------------------- FIXED ACTION BUTTONS

// FAB-FOLDER EVENTS ----------------------------------------
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
			if (primaryAction == "ion-document-text")
				Lists.insert({createdBy: userId, name: fabText, parent: Session.get('currPageId')})
			else if (primaryAction == "ion-folder")
				Folders.insert({createdBy: userId, name: fabText, parent: Session.get('currPageId')})
			event.target.fabText.value = ""
		} 
	}
})

// FAB-LIST EVENTS ------------------------------------
Template.fabForList.events
({
	'click #fabInputBar': function(event)
	{
		var primaryAction = Session.get('primaryActionL')
		if (primaryAction == "ion-edit")
			event.target.value = Tasks.findOne({ _id: Session.get('selectedTask') }).name
	},
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
		
		if (oldPrimaryAction == 'ion-android-calendar') Session.delete('addingTime')
		if (newPrimaryAction == 'ion-android-calendar') Session.set('addingTime', true)
	},
	'click #primaryActionL': function()
	{
		if (Session.get('primaryActionL') == 'ion-edit')		
		{ 
			Session.set('primaryActionL', 'ion-plus')
			$('.selectedTask').removeClass('selectedTask')
			Session.delete('selectedTask')
			$('#fabInputBar').val(undefined); $('#fabInputBar').blur()  
		} 		
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
			if (primaryAction == "ion-plus")
				Tasks.insert({createdBy: userId, name: fabText, parent: Session.get('currPageId')})
			
			else if (primaryAction == "ion-arrow-move")
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

// LIST EVENTS ----------------------------------

Template.list.events
({
	'click .collection-item': function(event)
	{
		var primaryAction = Session.get('primaryActionL')
		
		if (primaryAction == "ion-plus" || "ion-android-calendar")
		{
			var selectedTask = Session.get('selectedTask')
			$('.selectedTask').removeClass('selectedTask')
			
			if (event.target.id == selectedTask)
			{
				Session.delete('selectedTask')
				$('#fabInputBar').val(undefined); $('#fabInputBar').blur() 
				if (primaryAction == "ion-edit")
					Session.set('primaryActionL', "ion-plus")
			}					
				
			else
			{
				Session.set('selectedTask', event.target.id)
				$("#" + event.target.id).addClass('selectedTask')				
				if (primaryAction == "ion-plus")
					Session.set('primaryActionL', 'ion-edit')
				else if (primaryAction == 'ion-android-calendar')
					Meteor.setTimeout(function(){ $('.datepicker').focus() }, 200)
			}
		}
	}
})
