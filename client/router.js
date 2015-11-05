Router.configure({ layoutTemplate: 'defLayout' })

Router.map(function()
{
	this.route('home', {path: '/'})
	this.route('userAccounts')
	this.route('navbar')
	this.route('fabForFolder')
	this.route('fabForList')
	this.route('root')
	this.route('datepicker')
	this.route('timepicker')
})

Router.route(':_id', function()
{ // unoteworty note: could probably use this.params for data
	var folder = Folders.findOne({_id: this.params._id})
	var list = Lists.findOne({_id: this.params._id})
	if (folder)
		this.render('folder', {data: folder})
	else if (list)
		this.render('list', {data: list})
})
