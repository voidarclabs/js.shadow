function files() {
    document.getElementById('app-frame').src = 'apps/files.html'
    document.getElementById('apps').className = 'open'
}

function email() {
    document.getElementById('app-frame').src = 'apps/email.html'
    document.getElementById('apps').className = 'open'
}

function closeApps() {
    document.getElementById('apps').className = 'closed'
    console.log('e')
}
