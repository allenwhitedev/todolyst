Meteor.startup(function()
{ // set session/localStorage variables to defaults if not set (3 cases below)
	if ( !Session.get('primaryAction') )
	{
		Session.set('primaryAction', 'mode_edit')
		Session.set('secondaryAction', 'folder')
		Session.set('tertiaryAction', 'alarm_add')
		Session.set('quaternaryAction', 'note_add')			
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
Template.fab.events
({
	'click .fixed-action-btn > ul > li > a': function(event)
	{
		var oldPrimaryAction = Session.get('primaryAction')
		console.log(event.target.id.toString())
		var newPrimaryAction = Session.get(event.target.id)
		console.log(newPrimaryAction)
		Session.set('primaryAction', newPrimaryAction)
		Session.set(event.target.id, oldPrimaryAction)
	}
})

