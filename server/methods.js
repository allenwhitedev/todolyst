Meteor.publish('lists', function()
{
	return Lists.find({})
})

Meteor.publish('folders', function()
{
	return Folders.find({})
})