Router.configure({ layoutTemplate: 'defLayout' })

Router.map(function()
{
	this.route('home', {path: '/'})
	this.route('userAccounts')
	this.route('navbar')
	this.route('fab')
})

