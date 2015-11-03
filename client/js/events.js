Meteor.startup(function()
{
	if ( !Session.get('primaryAction') )
	{
		Session.set('primaryAction', 'mode_edit')
		Session.set('secondaryAction', 'folder')
		Session.set('tertiaryAction', 'alarm_add')
		Session.set('quaternaryAction', 'note_add')			
	}
	if ( !Session.get('currPage') )
		Session.set('currPage', 'todolyst')
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

