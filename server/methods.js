Meteor.publish('lists', function(userId)
{
	return Lists.find({createdBy: userId})
})

Meteor.publish('folders', function(userId)
{
	return Folders.find({createdBy: userId})
})

Meteor.methods
({
	'importAnonData': function(anonUserId, userId)
	{
		Lists.update({createdBy: anonUserId}, {$set: {createdBy: userId}}, {multi: true}),
		Folders.update({createdBy: anonUserId}, {$set: {createdBy: userId}}, {multi: true})
	}
})